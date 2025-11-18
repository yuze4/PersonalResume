# Personal Resume

A minimal Flask-based web page that showcases Yuze Li's resume with a lightweight commenting section. Comment data is stored under `/var/data` so it can be persisted via a Docker volume.

## Running locally (without Docker)
1. Create and activate a virtual environment (optional but recommended).
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   python app.py
   ```
4. Open http://localhost:8000 in your browser.

## Running with Docker
Build the image:
```bash
docker build -t personal-resume .
```

Run the container with a host-mounted data directory to persist comments:
```bash
docker run -p 8000:8000 -v /var/data:/var/data personal-resume
```

Your comments will be saved to `/var/data/comments.json` on the host. Update the left-hand path in the `-v` flag if you prefer a different host directory.

## Project structure
- `app.py`: Flask app serving the resume page and comment API.
- `templates/index.html`: Resume markup and comment form.
- `static/styles.css`: Styling for the page.
- `static/script.js`: Front-end interactions for comments.
- `requirements.txt`: Python dependencies.
- `Dockerfile`: Container definition using a slim Python base image.
