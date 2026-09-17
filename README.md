# Chatbot App

A retrieval-augmented generation (RAG) chatbot that lets users upload documents, build searchable vector indexes, and ask context-aware questions about their content. The project includes a FastAPI backend, a React + TypeScript web interface, and an optional Streamlit UI.

## Features

- Upload documents for processing and embedding.
- Store and search document embeddings with FAISS.
- Ask questions grounded in uploaded documents.
- Generate answers through an Ollama-backed language model.
- Organize indexes by a user-defined vector name.
- View conversation history in the web interface.
- Use either the React frontend or the included Streamlit interface.

## Architecture

```text
chatbot-app/
├── controllers/       # Embedding and LLM integration logic
├── faiss_indexes/     # Generated FAISS indexes
├── frontend/          # React + TypeScript + Vite application
│   └── src/
├── models/            # API request and response models
├── routes/             # FastAPI chat and document-ingestion routes
├── main.py             # FastAPI application entry point
└── ui.py               # Optional Streamlit interface
```

### Request flow

1. A document is uploaded through the frontend or `/api/v1/ingest`.
2. The backend processes the document and creates embeddings.
3. Embeddings are stored in a FAISS index.
4. A question is sent to `/api/v1/chat` with the vector name.
5. Relevant document context is retrieved and passed to the configured LLM.
6. The generated answer is returned to the client.

## Prerequisites

- Python 3.10 or later
- Node.js 18 or later and npm
- [Ollama](https://ollama.com/) installed and running, with a model available for inference
- A model and embedding configuration compatible with the code in `controllers/`

## Backend setup

From the repository root, create and activate a virtual environment:

```bash
python -m venv .venv

# macOS/Linux
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1
```

Install the Python dependencies used by the backend:

```bash
pip install fastapi uvicorn python-multipart requests streamlit faiss-cpu sentence-transformers langchain ollama
```

Start the API:

```bash
python main.py
```

The API will be available at [http://localhost:8000](http://localhost:8000). FastAPI's interactive documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

> The backend currently enables permissive CORS for local development. Restrict `allow_origins` in `main.py` before deploying publicly.

## Frontend setup

Install the frontend dependencies and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually [http://localhost:5173](http://localhost:5173).

The frontend expects the API at `http://127.0.0.1:8000`. If the backend runs elsewhere, update the API URL in the frontend components or configure a Vite proxy.

Available frontend scripts:

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Optional Streamlit UI

The repository also includes `ui.py`, an alternative Streamlit interface for document ingestion and chat:

```bash
streamlit run ui.py
```

The Streamlit UI uses the backend endpoints at `http://127.0.0.1:8000`. Start the FastAPI backend first.

## API reference

All application routes are prefixed with `/api/v1`.

### Health check

```http
GET /
```

Example response:

```json
{
  "message": "Welcome to the Chatbot API"
}
```

### Ingest a document

```http
POST /api/v1/ingest
Content-Type: multipart/form-data
```

The uploaded document is sent in a form field named `file`.

```bash
curl -X POST http://localhost:8000/api/v1/ingest \
  -F "file=@path/to/document.txt"
```

### Chat with an indexed document

```http
POST /api/v1/chat?vector_name=<index-name>
Content-Type: application/json
```

Request body:

```json
{
  "query": "What are the main topics in this document?"
}
```

Example with cURL:

```bash
curl -X POST "http://localhost:8000/api/v1/chat?vector_name=Alex_Roy_Resume" \
  -H "Content-Type: application/json" \
  -d '{"query":"What projects are described in the document?"}'
```

Example response:

```json
{
  "response": "..."
}
```

A missing FAISS index returns `404`, an empty query returns `400`, and unexpected processing errors return `500`.

## Supported documents

The Streamlit interface is configured for `.txt`, `.pdf`, and `.docx` uploads. Confirm that the embedding implementation supports the selected format before using it in production.

## Configuration notes

- Generated indexes are written under `faiss_indexes/`.
- Do not commit private documents, credentials, or generated indexes unless intentionally required.
- Configure the Ollama model and endpoint in `controllers/ask_ollama.py`.
- The frontend and Streamlit UI currently use local development URLs; update them for staging or production deployments.

## Development

Before opening a pull request, run the frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

For backend changes, verify the API using `/docs` and test both ingestion and chat against a known document and vector name.

## License

No license file is currently included in the repository. Add a `LICENSE` file if you plan to distribute or reuse this project under a specific open-source license.
