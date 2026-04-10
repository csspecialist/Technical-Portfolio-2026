import json
import time
from huggingface_hub import InferenceClient
from pinecone import Pinecone
import numpy as np

# ==========================================
# 1. Configuration & API Keys
# ==========================================
PINECONE_API_KEY = ""
HUGGINGFACE_API_KEY = ""
INDEX_NAME = "bilingual-docs"

# Language-specific models
LANGUAGE_MODELS = {
    "en": "sentence-transformers/all-MiniLM-L6-v2",
    "fr": "sentence-transformers/all-MiniLM-L6-v2",  # Works for French too
    "fr-ca": "sentence-transformers/all-MiniLM-L6-v2"  # Works for Canadian French too
}

# ==========================================
# 2. Initialize HuggingFace and Pinecone
# ==========================================
try:
    hf_client = InferenceClient(api_key=HUGGINGFACE_API_KEY)
    print("✓ Connected to HuggingFace Inference API")
except Exception as e:
    print(f"❌ Error connecting to HuggingFace: {e}")
    exit()

try:
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(INDEX_NAME)
    index_stats = index.describe_index_stats()
    print(f"✓ Connected to Pinecone index: {INDEX_NAME}")
    print(f"  Dimension: {index_stats.get('dimension', 'unknown')}")
    print(f"  Total vectors: {index_stats.get('total_vector_count', 0)}\n")
except Exception as e:
    print(f"❌ Error connecting to Pinecone: {e}")
    print("   Check your API key and index name")
    exit()

# ==========================================
# 3. Load Your Documentation Chunks
# ==========================================
try:
    with open('knowledge_base.json', 'r', encoding='utf-8') as f:
        docs = json.load(f)
    print(f"✓ Loaded {len(docs)} documentation chunks\n")
    
    # Show sample
    if len(docs) > 0:
        sample = docs[0]
        print("Sample chunk:")
        print(f"  - ID: {sample.get('id')}")
        print(f"  - Language: {sample.get('language')}")
        print(f"  - Text length: {len(sample.get('text', ''))}")
        print(f"  - URL: {sample.get('url_path')}\n")
        
except FileNotFoundError:
    print("❌ Error: Could not find knowledge_base.json in current directory")
    print("   Make sure knowledge_base.json is in the same folder as this script")
    exit()
except json.JSONDecodeError as e:
    print(f"❌ Error: knowledge_base.json is not valid JSON: {e}")
    exit()

# ==========================================
# 4. Helper Function to Get Embeddings
# ==========================================
def get_embedding(text, language="en"):
    """
    Get embedding from HuggingFace using the official SDK.
    Returns a list of floats (the embedding vector).
    """
    if not text or not text.strip():
        return None
    
    # Select model based on language
    model = LANGUAGE_MODELS.get(language, LANGUAGE_MODELS["en"])
    
    # Retry logic
    for attempt in range(3):
        try:
            result = hf_client.feature_extraction(
                text,
                model=model
            )
            
            # Convert numpy array to list if needed
            if isinstance(result, np.ndarray):
                embedding = result.tolist()
            elif isinstance(result, list):
                if len(result) > 0 and isinstance(result[0], list):
                    embedding = result[0]
                else:
                    embedding = result
            else:
                embedding = result
            
            # Verify we got a valid embedding
            if isinstance(embedding, (list, np.ndarray)) and len(embedding) > 0:
                return list(embedding) if isinstance(embedding, np.ndarray) else embedding
            else:
                print(f"\n    Unexpected response format")
                return None
                
        except Exception as e:
            error_msg = str(e)
            
            if "401" in error_msg or "Unauthorized" in error_msg:
                print(f"\n    ❌ Authentication failed (401). Check your HF token.")
                return None
            elif "404" in error_msg or "not found" in error_msg.lower():
                print(f"\n    ❌ Model not found (404). Check model name: {model}")
                return None
            elif "overloaded" in error_msg.lower() or "loading" in error_msg.lower():
                if attempt < 2:
                    print(f"\n    ⏳ Service busy (attempt {attempt + 1}/3)... waiting 15s")
                    time.sleep(15)
                    continue
            else:
                if attempt < 2:
                    print(f"\n    ⏳ Retry (attempt {attempt + 1}/3)... {error_msg[:100]}")
                    time.sleep(5)
                    continue
            
            print(f"\n    ❌ Failed to get embedding: {error_msg[:150]}")
            return None
    
    return None

# ==========================================
# 5. Process and Upsert to Pinecone
# ==========================================
vectors_to_upsert = []
skipped_count = 0

print("="*60)
print("Starting embedding process...")
print("="*60 + "\n")

for i, doc in enumerate(docs, 1):
    text = doc.get('text', '').strip()
    language = doc.get('metadata', {}).get('language', 'en')
    doc_id = doc.get('id', f"chunk_{i}")
    url_path = doc.get('metadata', {}).get('url_path', '/')
    
    if not text:
        print(f"[{i}/{len(docs)}] ⚠️  Skipped (empty text)")
        skipped_count += 1
        continue
    
    print(f"[{i}/{len(docs)}] Processing '{doc_id}' (lang: {language})...", end=" ", flush=True)
    vector = get_embedding(text, language)
    
    if vector and len(vector) > 0:
        vectors_to_upsert.append({
            "id": doc_id,
            "values": vector,
            "metadata": {
                "text": text[:500],
                "url_path": url_path,
                "language": language,
                "full_text_length": len(text)
            }
        })
        print("✓")
    else:
        print("❌")
        skipped_count += 1
    
    # Small delay to avoid rate limiting
    time.sleep(0.3)

# ==========================================
# 6. Upsert in Batches
# ==========================================
print(f"\n{'='*60}")

if vectors_to_upsert:
    BATCH_SIZE = 50
    print(f"Upserting {len(vectors_to_upsert)} vectors to Pinecone...")
    print(f"Skipped: {skipped_count} chunks")
    print(f"{'='*60}\n")
    
    try:
        for i in range(0, len(vectors_to_upsert), BATCH_SIZE):
            batch = vectors_to_upsert[i:i + BATCH_SIZE]
            batch_num = (i // BATCH_SIZE) + 1
            total_batches = (len(vectors_to_upsert) + BATCH_SIZE - 1) // BATCH_SIZE
            
            index.upsert(vectors=batch)
            print(f"✓ Batch {batch_num}/{total_batches} upserted ({len(batch)} vectors)")
        
        print(f"\n{'='*60}")
        print("✓ SUCCESS! All chunks are now in Pinecone.")
        print(f"{'='*60}\n")
        
    except Exception as e:
        print(f"❌ Error upserting to Pinecone: {e}")
        
else:
    print("❌ No valid vectors to upsert.")
    print("Possible causes:")
    print("  1. All chunks have empty text")
    print("  2. Embedding API failed")
    print("  3. Invalid knowledge_base.json format")
    print(f"{'='*60}\n")