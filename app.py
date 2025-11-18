import json
import os
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory, render_template

app = Flask(__name__)

DATA_DIR = "/var/data"
COMMENTS_FILE = os.path.join(DATA_DIR, "comments.json")


def ensure_data_dir() -> None:
    os.makedirs(DATA_DIR, exist_ok=True)


def read_comments() -> list:
    if not os.path.exists(COMMENTS_FILE):
        return []
    with open(COMMENTS_FILE, "r", encoding="utf-8") as handle:
        try:
            return json.load(handle)
        except json.JSONDecodeError:
            return []


def write_comments(comments: list) -> None:
    ensure_data_dir()
    with open(COMMENTS_FILE, "w", encoding="utf-8") as handle:
        json.dump(comments, handle, ensure_ascii=False, indent=2)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/comments", methods=["GET", "POST"])
def comments():
    if request.method == "GET":
        return jsonify(read_comments())

    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "Anonymous").strip()
    message = (payload.get("message") or "").strip()

    if not message:
        return jsonify({"error": "Message is required."}), 400

    comment = {
        "name": name if name else "Anonymous",
        "message": message,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }

    comments_data = read_comments()
    comments_data.append(comment)
    write_comments(comments_data)

    return jsonify(comment), 201


@app.route("/static/<path:path>")
def serve_static(path: str):
    return send_from_directory("static", path)


if __name__ == "__main__":
    ensure_data_dir()
    app.run(host="0.0.0.0", port=8000)
