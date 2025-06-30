import streamlit as st
import requests
import os

# Backend URLs
CHAT_URL = "http://127.0.0.1:8000/chat"
INGEST_URL = "http://127.0.0.1:8000/ingest"

st.set_page_config(page_title="RAG Chatbot", layout="centered")
st.title("🤖 RAG-based Chatbot with Memory")

# Session memory
if "log" not in st.session_state:
    st.session_state.log = []  # stores (user_message, bot_response) tuples

# Tabs
tab1, tab2 = st.tabs(["💬 Chat", "📁 Ingest"])

# -------------------------------
# 🚀 CHAT TAB
# -------------------------------
with tab1:
    st.subheader("Chat with your document")

    vector = st.text_input("Document vector name (e.g., Alex_Roy_Resume):", value="Alex_Roy_Resume")

    user_query = st.text_area("Ask something...", height=100)

    if st.button("Send Query"):
        if not user_query.strip():
            st.warning("Please enter a question.")
        else:
            payload = {
                "query": user_query,
                "vector": vector,
                "description": "string"
            }

            try:
                response = requests.post(CHAT_URL, json=payload)
                response.raise_for_status()
                bot_response = response.json().get("response", "No answer returned.")

                # Save to log
                st.session_state.log.append((user_query, bot_response))

            except Exception as e:
                bot_response = f"❌ Error: {e}"
                st.session_state.log.append((user_query, bot_response))

    # Display full conversation
    for i, (user_msg, bot_msg) in enumerate(st.session_state.log):
        st.markdown(f"**You:**")
        st.info(user_msg, icon="🧑")
        st.markdown(f"**Bot:**")
        st.success(bot_msg, icon="🤖")

# -------------------------------
# 📁 INGEST TAB
# -------------------------------
with tab2:
    st.subheader("Upload a document")

    uploaded_file = st.file_uploader(
        "Drag and drop or browse a document",
        type=["txt", "pdf", "docx"]
    )

    if st.button("Upload Document"):
        if uploaded_file:
            files = {
                "file": (uploaded_file.name, uploaded_file.read(), uploaded_file.type)
            }

            try:
                response = requests.post(INGEST_URL, files=files)
                response.raise_for_status()
                st.success(f"✅ Uploaded '{uploaded_file.name}' successfully!")
            except Exception as e:
                st.error(f"❌ Upload failed: {e}")
        else:
            st.warning("Please select a file first.")
