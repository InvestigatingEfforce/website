/**
 * Cloudflare Worker: Anthropic API Proxy for "Ask Mike" Chatbot
 * 
 * SETUP:
 * 1. Go to dash.cloudflare.com → Workers & Pages → Create Worker
 * 2. Paste this code
 * 3. Go to Settings → Variables → add ANTHROPIC_API_KEY (encrypted)
 * 4. Deploy
 * 5. Update detective.html API_ENDPOINT to your worker URL
 *    e.g. "https://mike-detective.yourdomain.workers.dev"
 * 
 * COST ESTIMATE: ~$5-15/month for moderate traffic (50 users/day × 3 questions)
 * Cloudflare Workers free tier: 100K requests/day
 */

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://investigatingefforce.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();

      // Validate: only allow claude-sonnet-4-20250514
      if (body.model !== 'claude-sonnet-4-20250514') {
        return new Response('Invalid model', { status: 400, headers: corsHeaders });
      }

      // Enforce max_tokens limit
      body.max_tokens = Math.min(body.max_tokens || 1000, 1500);

      // Forward to Anthropic
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });

      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
