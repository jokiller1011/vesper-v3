// Cloudflare Worker – Prøxy backend + Static Frontend for Vesper v3
const BARE_SERVER = 'https://bare.mercuryworkshop.org/'; // Public Bare server for actual proxying

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

    // --- Prøxy Bare Server Routing ---
    if (path.startsWith('/bare/')) {
      const target = BARE_SERVER + path.replace('/bare/', '');
      return fetchWithCors(target, request, corsHeaders);
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

async function fetchWithCors(target, originalRequest, corsHeaders) {
  const newReq = new Request(target, {
    method: originalRequest.method,
    headers: originalRequest.headers,
    body: originalRequest.body,
  });
  const response = await fetch(newReq);
  const newResponse = new Response(response.body, response);
  Object.entries(corsHeaders).forEach(([k, v]) => newResponse.headers.set(k, v));
  return newResponse;
}
