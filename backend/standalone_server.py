import http.server
import json
import urllib.parse
from app.service import service
from app.preprocessing import preprocess_pipeline_inspect

PORT = 8000

class HotelAPIRequestHandler(http.server.BaseHTTPRequestHandler):
    def _set_headers(self, status_code=200, content_type="application/json"):
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path in ["/", "/api", "/api/health"]:
            self._set_headers()
            resp = {
                "status": "healthy",
                "service": "HotelInsight AI Engine",
                "version": "2.4.0",
                "device": service.engine.device,
                "pytorch_active": service.engine.is_pytorch_active,
            }
            self.wfile.write(json.dumps(resp).encode("utf-8"))

        elif path == "/api/metrics":
            self._set_headers()
            metrics = service.get_metrics()
            dump = metrics.model_dump() if hasattr(metrics, "model_dump") else metrics.__dict__
            self.wfile.write(json.dumps(dump).encode("utf-8"))

        elif path == "/api/dashboard-overview":
            self._set_headers()
            overview = service.get_dashboard_overview()
            dump = overview.model_dump() if hasattr(overview, "model_dump") else overview.__dict__
            self.wfile.write(json.dumps(dump).encode("utf-8"))

        elif path == "/api/preprocess-debug":
            text = query.get("text", [""])[0]
            if not text:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Missing text parameter"}).encode("utf-8"))
                return
            res = preprocess_pipeline_inspect(text)
            dump = res.model_dump() if hasattr(res, "model_dump") else res.__dict__
            self._set_headers()
            self.wfile.write(json.dumps(dump).encode("utf-8"))

        elif path == "/api/export-sample-csv":
            self._set_headers(200, "text/csv")
            csv_data = (
                "review_text,actual_rating\n"
                '"The service was wonderful and staff was polite.",5.0\n'
                '"Oh, absolutely loved the ocean view through the tiny gap between buildings!",1.0\n'
                '"Terrible experience! 😡 Filthy room and noisy AC.",1.0\n'
            )
            self.wfile.write(csv_data.encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(length).decode("utf-8")

        if path == "/api/predict":
            try:
                body = json.loads(raw_body)
                text = body.get("text", "")
            except Exception:
                text = ""

            if not text.strip():
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Empty review text"}).encode("utf-8"))
                return

            res = service.predict_single(text)
            dump = res.model_dump() if hasattr(res, "model_dump") else res.__dict__
            self._set_headers()
            self.wfile.write(json.dumps(dump).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode("utf-8"))

def main():
    server = http.server.ThreadingHTTPServer(("0.0.0.0", PORT), HotelAPIRequestHandler)
    print(f"[*] HotelInsight AI Server listening on http://localhost:{PORT}")
    print(f"[*] Serving: /api/predict, /api/preprocess-debug, /api/metrics, /api/dashboard-overview")
    server.serve_forever()

if __name__ == "__main__":
    main()
