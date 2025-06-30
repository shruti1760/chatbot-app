# chat API

A FastAPI-based chat application that allows users to upload documents, embed them using FAISS and Sentence Transformers, and ask questions with context-aware answers powered by LLMs (such as Ollama's Llama 3).

---

## Features

- **Document Upload:** Upload one or more documents for embedding and retrieval.
- **Contextual Q&A:** Ask questions and get answers based on the content of uploaded documents.
- **Vector Search:** Uses FAISS for fast similarity search over document embeddings.
- **Extensible:** Easily supports multiple vector stores and context selection strategies.
- **LLM Integration:** Uses Ollama or other LLMs for generating answers.

---

## Getting Started

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd chat-app
```

### 2. Install Dependencies

```sh
pip install -r requirements.txt
```

Make sure you have [Ollama](https://ollama.com/) installed and running if you use it for LLM inference.

### 3. Run the Application

```sh
python main.py
```

The API will be available at [http://localhost:8000](http://localhost:8000).

---

## API Endpoints

### `POST /upload`
Upload one or more documents for embedding.

**Request:**  
- `files`: List of files (multipart/form-data)

**Response:**  
```json
{
  "results": [
    "Document1.txt embedded successfully.",
    "Document2.txt embedded successfully."
  ]
}
```

---

### `POST /chat`
Ask a question and get a context-aware answer.

**Request Body:**
```json
{
  "query": "What projects has Alex Roy worked on?",
  "vectorname": "default",         // (optional, for future multi-vector support)
  "description": "Resume context"  // (optional, for future use)
}
```

**Response:**
```json
{
  "response": "Alex Roy has worked on Customer Churn Prediction System, Stock Market Trend Analyzer, and E-commerce Dashboard with Power BI."
}
```

---

## Project Structure

```
chat-app/
│
├── controllers/
│   ├── ask_ollama.py
│   ├── embedding.py
│
├── routes/
│   ├── chat.py
│   ├── ingest.py
│
├── model/
│   └── chat.py
│
├── main.py
├── requirements.txt
└── README.md
```

---

## Customization

- **Selector Function:**  
  The selector function in `routes/chat.py` can be extended to support multiple vector stores or advanced context selection.

- **LLM Model:**  
  Change the model in `controllers/ask_ollama.py` to use a different LLM or endpoint.

---

## License

MIT License

---

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [FAISS](https://github.com/facebookresearch/faiss)
- [Sentence Transformers](https://www.sbert.net/)
- [Ollama](https://ollama.com/)
- [LangChain](https://python.langchain.com/)
