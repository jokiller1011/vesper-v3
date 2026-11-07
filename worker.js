// Cloudflare Worker – Prøxy backend + Static Frontend for Vesper v3

// Public Bare servers for proxying fallback
const BARE_SERVERS = [
  'https://bare.mercuryworkshop.org/',
  'https://demo-opensource.rammerhead.org/',
  'https://uv.example.com/bare/' // Backup placeholder
];
let bareIndex = 0;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // --- Prøxy Bare Server Routing with Fallback ---
    if (path.startsWith('/bare/')) {
      for (let i = 0; i < BARE_SERVERS.length; i++) {
        const server = BARE_SERVERS[(bareIndex + i) % BARE_SERVERS.length];
        try {
          const target = server + path.replace('/bare/', '');
          const response = await fetch(target, {
            method: request.method,
            headers: request.headers,
            body: request.body,
          });
          if (response.ok) {
            bareIndex = (bareIndex + i) % BARE_SERVERS.length; // Update to the working server
            return addCors(response, corsHeaders);
          }
        } catch (e) { /* Ignore and try next server */ }
      }
      return new Response('All Bare servers failed', { status: 502, headers: corsHeaders });
    }

    // --- Static Frontend Fallback ---
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404) {
        const indexUrl = new URL('/index.html', request.url);
        return await env.ASSETS.fetch(new Request(indexUrl, request));
      }
      return response;
    } catch (e) {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }
  },
};

function addCors(response, corsHeaders) {
  const newResponse = new Response(response.body, response);
  Object.entries(corsHeaders).forEach(([k, v]) => newResponse.headers.set(k, v));
  return newResponse;
}
