import os
import argparse
import time
from pathlib import Path
import pandas as pd
import numpy as np

try:
    import torch
    import torch.nn as nn
    from torch.utils.data import Dataset, DataLoader
    from transformers import BertTokenizerFast, get_linear_schedule_with_warmup
    from app.model import MultiTaskHotelBERT
    from app.preprocessing import stage1_clean_text, stage2_case_fold, stage3_handle_emojis
    TORCH_READY = True
except ImportError:
    TORCH_READY = False

class HotelReviewDataset(Dataset if TORCH_READY else object):
    def __init__(self, texts, labels, ratings, tokenizer, max_len=256):
        self.texts = texts
        self.labels = labels  # 0: Neg, 1: Neu, 2: Pos
        self.ratings = ratings  # 1.0 to 5.0
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, item):
        text = str(self.texts[item])
        # Run stages 1-3
        c, _ = stage1_clean_text(text)
        f, _ = stage2_case_fold(c)
        processed, _ = stage3_handle_emojis(f)

        encoding = self.tokenizer(
            processed,
            add_special_tokens=True,
            max_length=self.max_len,
            padding="max_length",
            truncation=True,
            return_token_type_ids=False,
            return_attention_mask=True,
            return_tensors="pt"
        )

        return {
            "input_ids": encoding["input_ids"].flatten(),
            "attention_mask": encoding["attention_mask"].flatten(),
            "label": torch.tensor(self.labels[item], dtype=torch.long),
            "rating": torch.tensor(self.ratings[item], dtype=torch.float)
        }

def rating_to_class(rating: float) -> int:
    if rating <= 2.0:
        return 0  # Negative
    elif rating <= 3.5:
        return 1  # Neutral
    return 2  # Positive

def train(data_path: str = None, epochs: int = 3, batch_size: int = 8, lr: float = 2e-5):
    if not TORCH_READY:
        print("[!] PyTorch and Transformers must be installed to run training.")
        print("Run: pip install torch transformers")
        return

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[*] Training on device: {device}")

    # Load data
    if data_path and os.path.exists(data_path):
        print(f"[*] Loading training data from: {data_path}")
        df = pd.read_csv(data_path)
    else:
        print("[*] Generating synthetic diverse hotel dataset for demonstration...")
        df = pd.DataFrame([
            {"review_text": "The service was wonderful and staff was polite.", "actual_rating": 5.0},
            {"review_text": "Oh, absolutely loved the ocean view through the tiny gap!", "actual_rating": 1.0},
            {"review_text": "Terrible experience! 😡 Filthy room and noisy AC.", "actual_rating": 1.0},
            {"review_text": "Lobby was nice, but AC sounded like a jet engine.", "actual_rating": 2.0},
            {"review_text": "Average stay, nothing special. Wifi worked fine.", "actual_rating": 3.0},
            {"review_text": "Super clean rooms, breakfast buffet had huge variety.", "actual_rating": 4.5},
            {"review_text": "Breathtaking views and top-notch concierge.", "actual_rating": 5.0},
            {"review_text": "Rude receptionist and unmade bed upon arrival.", "actual_rating": 1.0}
        ])

    text_col = "review_text" if "review_text" in df.columns else df.columns[0]
    rating_col = "actual_rating" if "actual_rating" in df.columns else df.columns[1]

    texts = df[text_col].tolist()
    ratings = [float(r) for r in df[rating_col].tolist()]
    labels = [rating_to_class(r) for r in ratings]

    print(f"[*] Total samples: {len(texts)}")

    tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
    dataset = HotelReviewDataset(texts, labels, ratings, tokenizer)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    model = MultiTaskHotelBERT(dropout_rate=0.3).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=0.01)

    loss_fn_cls = nn.CrossEntropyLoss()
    loss_fn_reg = nn.MSELoss()

    output_dir = Path("weights")
    output_dir.mkdir(parents=True, exist_ok=True)
    save_path = output_dir / "multi_task_hotel_bert.pt"

    print("\n--- Starting Joint Training ---")
    start_time = time.time()
    model.train()

    for epoch in range(epochs):
        epoch_cls_loss = 0.0
        epoch_reg_loss = 0.0
        epoch_total_loss = 0.0

        for batch in dataloader:
            input_ids = batch["input_ids"].to(device)
            attention_mask = batch["attention_mask"].to(device)
            targets_cls = batch["label"].to(device)
            targets_reg = batch["rating"].to(device).unsqueeze(1)

            optimizer.zero_grad()
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)

            loss_cls = loss_fn_cls(outputs["logits"], targets_cls)
            loss_reg = loss_fn_reg(outputs["rating"], targets_reg)

            # Joint loss with weighting factor
            joint_loss = loss_cls + 1.0 * loss_reg
            joint_loss.backward()

            nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

            epoch_cls_loss += loss_cls.item()
            epoch_reg_loss += loss_reg.item()
            epoch_total_loss += joint_loss.item()

        avg_total = epoch_total_loss / len(dataloader)
        avg_cls = epoch_cls_loss / len(dataloader)
        avg_reg = epoch_reg_loss / len(dataloader)
        print(f"Epoch [{epoch+1}/{epochs}] - Total Loss: {avg_total:.4f} (Cls CE: {avg_cls:.4f}, Reg MSE: {avg_reg:.4f})")

    torch.save(model.state_dict(), save_path)
    print(f"\n[✓] Training complete in {time.time() - start_time:.2f}s!")
    print(f"[✓] Multi-task model weights saved to: {save_path.resolve()}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune Multi-Task Hotel BERT")
    parser.add_argument("--data", type=str, default="app/data/sample_reviews.csv", help="Path to training CSV")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=4, help="Batch size")
    parser.add_argument("--lr", type=float, default=2e-5, help="Learning rate")
    args = parser.parse_args()

    train(data_path=args.data, epochs=args.epochs, batch_size=args.batch_size, lr=args.lr)
