# Import os to set API key
import os
# Import OpenAI as main LLM service
from langchain.llms import OpenAI
from langchain.embeddings import OpenAIEmbeddings
# Bring in streamlit for UI/app interface
import streamlit as st

from langchain.document_loaders import DirectoryLoader, TextLoader

# Import chroma as the vector store 
from langchain.vectorstores import Chroma

# Import vector store stuff
from langchain.agents.agent_toolkits import (
    create_vectorstore_agent,
    VectorStoreToolkit,
    VectorStoreInfo
)

# Set APIkey for OpenAI Service
# Can sub this out for other LLM providers
os.environ['OPENAI_API_KEY'] = 'youropenaiapikeyhere'

# Create instance of OpenAI LLM
llm = OpenAI(temperature=0.1, verbose=True)
embeddings = OpenAIEmbeddings()

# Create  Loader
DRIVE_FOLDER = "/Users/uri/kibbutznik_app/scr/modules"
loader = DirectoryLoader(DRIVE_FOLDER, glob='**/*.py', show_progress=True, loader_cls=TextLoader)
modules = loader.load()
print(f'document count: {len(modules)}')
print(modules[0] if len(modules) > 0 else None)

# Load modules into vector database aka ChromaDB
for x in modules:
    store = Chroma.from_documents(x, embeddings, collection_name='kbz_modules')
    print(store)


# Create vectorstore info object - metadata repo?
vectorstore_info = VectorStoreInfo(
    name="annual_report",
    description="a banking annual report as a pdf",
    vectorstore=store
)
# Convert the document store into a langchain toolkit
toolkit = VectorStoreToolkit(vectorstore_info=vectorstore_info)

# Add the toolkit to an end-to-end LC
agent_executor = create_vectorstore_agent(
    llm=llm,
    toolkit=toolkit,
    verbose=True)