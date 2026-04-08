import type { APIRoute } from 'astro';
import { Pinecone } from '@pinecone-database/pinecone';
import { HfInference } from '@huggingface/inference';

// Marks this endpoint as server-rendered
export const prerender = false;

// Helper to handle JSON parsing safely
function safeParseJSON(text: string, label: string) {
  if (!text || text.trim() === '') {
    throw new Error(`${label} returned an empty response.`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} returned invalid JSON: "${text.slice(0, 100)}..."`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { query, language } = body;

    if (!query || !language) {
      throw new Error('Missing query or language in request body.');
    }

    // 1. Initialize Pinecone
    const pc = new Pinecone({
      apiKey: import.meta.env.PINECONE_API_KEY,
    });
    const index = pc.index('bilingual-docs');

    // 2. Get Query Vector from HuggingFace using the SAME model as embedding
    // IMPORTANT: Must be the SAME model as used in re_embed.py
    const hf = new HfInference(import.meta.env.HUGGINGFACE_API_KEY as string);

    const queryEmbedding = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2', // SAME as re_embed.py
      inputs: query,
    });

    // Convert to array and handle numpy/list response
    let queryVector: number[];
    
    if (Array.isArray(queryEmbedding)) {
      if (queryEmbedding.length > 0 && Array.isArray(queryEmbedding[0])) {
        // Multiple embeddings, take first
        queryVector = queryEmbedding[0] as number[];
      } else {
        // Single embedding
        queryVector = queryEmbedding as number[];
      }
    } else {
      throw new Error('Unexpected embedding format');
    }

    // 3. Query Pinecone
    const queryResponse = await index.query({
      vector: queryVector,
      topK: 3,
      includeMetadata: true,
      filter: { language: { $eq: language } }
    });

    return new Response(JSON.stringify({
      results: queryResponse.matches
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};