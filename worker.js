// Cloudflare Worker – Prøxy backend + Static Frontend for Vesper v3
const SCRAMJET_CDN = 'https://cdn.jsdelivr.net/npm/@mercuryworkshop/scramjet@2.0.67-alpha.2/dist/';
const UV_CDN = 'https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet@3.0.0/dist/';
const RAMMERHEAD_BASE = 'https://rammerhead.example.com/';

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

    // --- Prøxy routes ---
    if (path.startsWith('/scramjet/')) {
      const subPath = path.replace('/scramjet/', '');
      return fetchWithCors(SCRAMJET_CDN + subPath, request, corsHeaders);
    }
    if (path.startsWith('/uv/')) {
      const subPath = path.replace('/uv/', '');
      return fetchWithCors(UV_CDN + subPath, request, corsHeaders);
    }
    if (path.startsWith('/rammerhead/')) {
      const subPath = path.replace('/rammerhead/', '');
      return fetchWithCors(RAMMERHEAD_BASE + subPath, request, corsHeaders);
    }

    // --- Static Frontend Fallback ---
    try {
      const response = await env.ASSETS.fetch(request);
      // If the file doesn't exist (e.g., an OAuth redirect URL), serve index.html
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
