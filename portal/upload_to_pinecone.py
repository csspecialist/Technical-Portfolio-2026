import json
from pinecone import Pinecone, ServerlessSpec # The new way
from sentence_transformers import SentenceTransformer

# Initialize with the new class-based syntax
pc = Pinecone(api_key="your-actual-pinecone-api-key")

# 2. Create the Index (if it doesn't exist)
index_name = "bilingual-docs"

if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=384, # 'all-MiniLM-L6-v2' uses 384 dimensions
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1") # Adjust to your region
    )

index = pc.Index(index_name)

# 3. Load the Local Embedding Model
# This is an open-source model that runs on YOUR computer
model = SentenceTransformer('all-MiniLM-L6-v2')

# 4. Load your Knowledge Base
with open('knowledge_base.json', 'r', encoding='utf-8') as f:
    chunks = json.load(f)

# 5. Convert Text to Vectors and Upload
print(f"🔄 Vectorizing and uploading {len(chunks)} chunks...")

vectors_to_upsert = []
for item in chunks:
    # Generate the embedding
    embedding = model.encode(item['text']).tolist()
    
    # NEW: Add the 'text' to the metadata dictionary
    metadata = item['metadata']
    metadata['text'] = item['text'] # <--- THIS IS THE KEY ADDITION
    
    vectors_to_upsert.append({
        "id": item['id'],
        "values": embedding,
        "metadata": metadata
    })

# Run the upsert again
index.upsert(vectors=vectors_to_upsert)
print("✅ Success! Metadata updated with full text.")