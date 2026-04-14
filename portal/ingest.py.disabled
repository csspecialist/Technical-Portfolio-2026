import os
import re
import json

# Root of all documentation
BASE_DOCS_PATH = "./src/content/docs"
# Your specific language structure
LANGUAGES = ["en", "fr", "fr-ca"] 

def chunk_markdown(file_path, lang, lang_base_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = re.sub(r'---.*?---', '', content, flags=re.DOTALL)
    chunks = re.split(r'\n## ', content)

    # Compute full relative path, e.g. "sops/vpn-mfa-config"
    relative_path = os.path.relpath(file_path, lang_base_path)
    clean_path = relative_path.replace('.mdx', '').replace('.md', '').replace('\\', '/')

    processed_chunks = []
    for i, chunk in enumerate(chunks):
        if not chunk.strip():
            continue

        processed_chunks.append({
            "id": f"{lang}-{clean_path.replace('/', '-')}-{i}",
            "text": chunk.strip(),
            "metadata": {
                "source": os.path.basename(file_path),
                "language": lang,
                "url_path": f"/{lang}/{clean_path}"
            }
        })
    return processed_chunks

all_data = []

# Loop through en, fr, and fr-ca folders
for lang in LANGUAGES:
    lang_path = os.path.join(BASE_DOCS_PATH, lang)
    if os.path.exists(lang_path):
        print(f"Reading {lang} directory...")
        for root, dirs, files in os.walk(lang_path):
            for file in files:
                if file.endswith((".md", ".mdx")) and not file.startswith("index"):
                    file_full_path = os.path.join(root, file)
                    all_data.extend(chunk_markdown(file_full_path, lang, lang_path))
    else:
        print(f"⚠️ Warning: Directory {lang_path} not found.")

# Save with ensure_ascii=False to handle French accents (é, à, ç) correctly
with open('knowledge_base.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, indent=4, ensure_ascii=False)

print(f"\n✅ Success! Created {len(all_data)} chunks across 3 languages.")