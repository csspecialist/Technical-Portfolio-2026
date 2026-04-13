import os
import time

from dotenv import load_dotenv
import google.generativeai as genai

# ==========================================
# 1. Configuration & Setup
# ==========================================
load_dotenv()  # Loads from .env locally; no-ops in CI where real env vars exist

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("❌ ERROR: GOOGLE_API_KEY environment variable not found.")
    exit(1)

genai.configure(api_key=GOOGLE_API_KEY)

# Using Gemini 2.5 Flash for fast, highly accurate text tasks
model = genai.GenerativeModel('gemini-2.5-flash')

BASE_EN_DIR = "./src/content/docs/en"
TARGET_LANGUAGES = {"fr": "French", "fr-ca": "Canadian French"}

# ==========================================
# 2. The AI Translation Agent
# ==========================================
def translate_markdown(content, target_language):
    prompt = f"""
    You are an expert Bilingual Technical Content Architect. 
    Translate the following Markdown documentation into {target_language}.
    
    CRITICAL RULES:
    1. Preserve all Markdown syntax (headers, lists, bolding).
    2. Preserve all frontmatter exactly as it is EXCEPT the `lang:` field,
       which must be updated to match the target language code.
    3. DO NOT translate code blocks, API endpoints, or JSON keys.
    4. Maintain a professional, technical tone.
    5. Return ONLY the translated content, no preamble or explanation.
    
    Here is the content to translate:
    {content}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ API Error: {e}")
        return None

# ==========================================
# 3. Pipeline Execution
# ==========================================
print(f"🚀 Starting Auto-Translation Pipeline...")

# Walk through all English files
for root, dirs, files in os.walk(BASE_EN_DIR):
    for file in files:
        if file.endswith((".md", ".mdx")):
            en_file_path = os.path.join(root, file)
            
            # Read the English content
            with open(en_file_path, 'r', encoding='utf-8') as f:
                en_content = f.read()

            # Process for each target language
            for lang_code, lang_name in TARGET_LANGUAGES.items():
                # Calculate where the new file should go
                target_dir = root.replace("/en", f"/{lang_code}", 1)
                os.makedirs(target_dir, exist_ok=True)
                target_file_path = os.path.join(target_dir, file)

                # ARCHITECT RULE: Only translate if the file doesn't exist yet
                if not os.path.exists(target_file_path):
                    print(f"🔄 Translating {file} to {lang_name}...")
                    translated_text = translate_markdown(en_content, lang_name)
                    
                    if translated_text:
                        with open(target_file_path, 'w', encoding='utf-8') as f:
                            f.write(translated_text)
                        print(f"✅ Saved: {target_file_path}")
                        time.sleep(1)  # Avoid hitting API rate limits
                else:
                    print(f"⏭️  Skipped (Already exists): {target_file_path}")

print("✨ Translation Pipeline Complete.")
