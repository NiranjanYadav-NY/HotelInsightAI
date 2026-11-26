# HotelInsight AI: Hotel Review Sentiment Analysis & Rating Prediction

A production-grade, full-stack AI web application for multi-task hotel review intelligence using a decoupled **FastAPI (Python)** backend and a **React 18 (Vite + TypeScript) + Tailwind CSS** frontend.

Designed according to a clean SaaS light-mode design system with deep slate navigation, royal indigo accents, emerald for positive sentiment, amber for neutral, and crimson for negative.

---

## 🌟 Key Features

1. **4-Stage Preprocessing Pipeline Inspector:**
   - **Stage 01 (Cleaning):** Regex-based stripping of HTML tags, URLs, and noisy formatting while preserving emotional punctuation (`!`, `?`, `""`).
   - **Stage 02 (Case Folding):** Normalization to lowercase matching BERT's uncased vocabulary.
   - **Stage 03 (Emoji Handling):** Conversion of Unicode emojis to descriptive tokens (e.g., `😡` $\rightarrow$ `:angry_face:`, `🤮` $\rightarrow$ `:nauseated_face:`) using `emoji.demojize()`.
   - **Stage 04 (Vectorization):** Subword tokenization using `BertTokenizerFast` (`max_length=256`), yielding `input_ids`, `attention_mask`, and human-readable tokens.
   - Live real-time inspection view exposing intermediate stages.

2. **Multi-Task BERT Transformer Architecture (`MultiTaskHotelBERT`):**
   - **Encoder Backbone:** 12-layer `bert-base-uncased` with 12 self-attention heads (768 hidden dimensions).
   - **Classification Head:** `Dropout(0.3)` + `Linear(768 -> 3)` with Softmax probabilities for `[Negative, Neutral, Positive]`.
   - **Regression Head:** `Dropout(0.3)` + `Linear(768 -> 1)` + scaled sigmoid mapping to continuous `1.0` to `5.0` star ratings.
   - **Joint Loss Function:** Joint multi-task optimization combining `CrossEntropyLoss` (sentiment) and `MSELoss` (rating regression).

3. **BERT Attention & Sarcasm Detection X-Ray:**
   - Normalized final-layer self-attention weight extraction ($\alpha \in [0.0, 1.0]$) per token.
   - Word-level interactive attention heatmap.
   - Side-by-side diagnostic contrasting **Legacy Keyword Baseline (Wrong)** with **Proposed Context-Aware BERT (Correct)** to expose sarcasm handling (e.g., detecting *"loved"* juxtaposed with *"tiny gap"* and *"jackhammer"*).

4. **Batch CSV & Dataset Analyzer:**
   - Drag-and-drop CSV upload for large review datasets (e.g. TripAdvisor, Booking.com).
   - Rating discrepancy detection (`|actual_rating - predicted_rating| >= 1.5`), highlighting potential fake reviews or reviewer errors.
   - Downloadable enriched CSV export.

5. **Model Benchmarks & Confusion Matrix Lab:**
   - Comparative accuracy bar chart: **BERT (85%)** vs. **Random Forest (78%)** vs. **LSTM (75%)**.
   - Normalized 3x3 Confusion Matrix heatmap.
   - Actual vs. Predicted star rating regression scatter plot with $R^2$ trendline.

6. **Aspect-Based Hospitality Insights & Model Ops:**
   - Radar chart across 5 key aspects: *Cleanliness*, *Staff Service*, *Wi-Fi & Amenities*, *Location*, and *Dining*.
   - Prescriptive AI management actions and top complaint n-gram badges.
   - Model Ops control panel with latency telemetry and live REST API playground.

---

## 🏗️ Architecture & Project Structure

```
Project_DLDA/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py              # Application settings, device configuration, CORS
│   │   ├── schemas.py             # Pydantic v2 schemas for all requests/responses
│   │   ├── preprocessing.py       # 4-stage preprocessing pipeline & debug inspector
│   │   ├── model.py               # MultiTaskHotelBERT nn.Module & inference engine
│   │   ├── service.py             # Business logic, baseline comparison, metrics provider
│   │   ├── main.py                # FastAPI app with async REST endpoints
│   │   └── data/
│   │       └── sample_reviews.csv # Sample benchmark dataset
│   ├── train.py                   # Joint loss fine-tuning script (CrossEntropy + MSE)
│   ├── test_backend.py            # Self-test verification suite
│   ├── standalone_server.py       # Zero-dependency HTTP test runner
│   └── requirements.txt           # Python package dependencies
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Sidebar.tsx        # Deep slate navigation sidebar
│   │   │   ├── TopHeader.tsx      # SaaS top bar with search & status
│   │   │   ├── StarRating.tsx     # 1-5 star visual component
│   │   │   ├── SentimentPill.tsx  # Emerald / Amber / Crimson status badges
│   │   │   └── AttentionHeatmap.tsx # Interactive token attention visualizer
│   │   ├── views/                 # 7 Dashboard Views
│   │   │   ├── ExecutiveOverview.tsx       # KPI cards, dual-axis trend chart, review feed
│   │   │   ├── SingleReviewInference.tsx   # Live prediction & Sarcasm X-Ray
│   │   │   ├── PreprocessingInspector.tsx  # 4-stage interactive pipeline inspector
│   │   │   ├── ModelArchitecture.tsx       # Flowchart, confusion matrix, scatter plot
│   │   │   ├── BatchCsvAnalyzer.tsx        # CSV upload, discrepancy detection, export
│   │   │   ├── AspectInsights.tsx          # Aspect radar chart & management actions
│   │   │   └── ModelOpsConfig.tsx          # Model telemetry & live API playground
│   │   ├── services/
│   │   │   └── api.ts             # Typed API client with client-side fallback
│   │   ├── types/
│   │   │   └── index.ts           # Complete TypeScript interfaces
│   │   ├── App.tsx                # Main view router & state
│   │   ├── index.css              # Tailwind styling
│   │   └── main.tsx               # React entrypoint
│   ├── index.html                 # HTML with Inter & JetBrains Mono fonts
│   ├── package.json               # Dependencies (React, Vite, Recharts, Lucide)
│   ├── tailwind.config.js         # Color tokens & typography
│   ├── tsconfig.json
│   └── vite.config.ts             # Vite build configuration with API proxy
│
└── README.md
```

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- **Python:** 3.11+
- **Node.js:** 18+ (with `npm`)

---

### 2. Backend Setup (`/backend`)

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Verify the setup with the built-in test suite:
   ```bash
   python test_backend.py
   ```

5. Launch the FastAPI server with hot-reload:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   *The FastAPI server will be live at `http://localhost:8000` (Interactive API docs at `http://localhost:8000/docs`).*

*(Optional) Standalone Runner:*
If testing without FastAPI/Uvicorn, you can run the zero-dependency test server:
```bash
python standalone_server.py
```

---

### 3. Frontend Setup (`/frontend`)

1. Open a second terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the JavaScript/TypeScript dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The React dashboard will be running at `http://localhost:5173`.*

---

## 🧠 Model Training & Fine-Tuning

The included `backend/train.py` script implements joint multi-task training on any hotel dataset containing text and 1–5 star ratings:

```bash
cd backend
python train.py --data app/data/sample_reviews.csv --epochs 3 --batch_size 8 --lr 2e-5
```

### Joint Multi-Task Loss Formulation:
$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{CrossEntropy}}(\hat{y}_{\text{cls}}, y_{\text{cls}}) + \lambda \cdot \mathcal{L}_{\text{MSE}}(\hat{y}_{\text{reg}}, y_{\text{reg}})$$

Where $\lambda = 1.0$, $y_{\text{cls}} \in \{0: \text{Negative}, 1: \text{Neutral}, 2: \text{Positive}\}$, and $\hat{y}_{\text{reg}} \in [1.0, 5.0]$. Fine-tuned weights are saved to `backend/weights/multi_task_hotel_bert.pt`.

---

## 📡 REST API Reference

### 1. Single Review Prediction
- **Endpoint:** `POST /api/predict`
- **Request Body:**
  ```json
  {
    "text": "Oh, absolutely loved the 'ocean view' through the tiny gap and the 'peaceful' jackhammer at 7 AM!"
  }
  ```
- **Response:**
  ```json
  {
    "sentiment": "Negative",
    "confidence": 0.94,
    "probabilities": {
      "negative": 0.80,
      "neutral": 0.14,
      "positive": 0.06
    },
    "predicted_rating": 1.8,
    "latency_ms": 38.0,
    "is_sarcasm": true,
    "sarcasm_probability": 0.938,
    "attention_weights": [
      { "token": "loved", "weight": 0.78, "sentiment_bias": "positive" },
      { "token": "'ocean view'", "weight": 0.84, "sentiment_bias": "positive" },
      { "token": "jackhammer", "weight": 0.91, "sentiment_bias": "negative" }
    ],
    "keyword_baseline": {
      "baseline_sentiment": "Positive",
      "baseline_score": 1.8,
      "verdict": "FAILED (Sarcasm Undetected)",
      "explanation": "Relies on manual keyword matching. Detected highly positive words: 'loved' (+1.0), 'peaceful' (+0.8). Sarcasm undetected."
    }
  }
  ```

### 2. Preprocessing Pipeline Inspector
- **Endpoint:** `GET /api/preprocess-debug?text=<raw_string>`
- **Response:** Returns step-by-step intermediate output for all 4 stages: `01_cleaning`, `02_case_folding`, `03_emoji_handling`, and `04_vectorization`.

### 3. Batch CSV Ingestion & Discrepancy Detection
- **Endpoint:** `POST /api/predict-batch` (Multipart Form File Upload `.csv`)
- **Response:** Computes rows with `pred_sentiment`, `pred_rating`, and flags `rating_discrepancy` when $| \text{actual} - \text{predicted} | \ge 1.5$.

### 4. Benchmark Metrics
- **Endpoint:** `GET /api/metrics`
- **Response:** Model comparison table (**BERT: 85%**, **Random Forest: 78%**, **LSTM: 75%**), 3x3 confusion matrix grid, and actual vs. predicted regression scatter points.

---

## 🎨 Design System Specifications

- **Background:** Clean SaaS slate `#F8FAFC`
- **Cards & Surfaces:** `#FFFFFF` with `1px solid #E2E8F0` borders and `0 1px 3px rgba(0,0,0,0.05)` subtle shadow
- **Sidebar:** Deep Slate `#1E293B` with contrasting white/blue active states
- **Primary Accents:** Royal Indigo `#2563EB`
- **Semantic Colors:**
  - Positive: Emerald `#10B981` (`#ECFDF5` background)
  - Neutral: Amber `#F59E0B` (`#FFFBEB` background)
  - Negative: Crimson `#EF4444` (`#FEF2F2` background)
- **Typography:** `Inter` for interface elements and `JetBrains Mono` for token IDs, tensors, latencies, and code.
