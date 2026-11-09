# Vesper v3

Vesper v3 is a modular web application shell designed for immersive content discovery and digital resource exploration.

## Features

- **Integrated Content Hub:** A unified interface for exploring web applications, interactive media, and external resources.
- **Modular Proxy Engine:** A flexible routing layer (Scramjet, Ultraviolet, Rammerhead) for seamless content retrieval across different web standards.
- **Customizable Workspace:** Adjust themes, layouts, and visibility settings to suit your preferences.
- **Privacy-First Design:** Built-in tools for managing your digital footprint.

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Authentication:** Supabase
- **Deployment:** Cloudflare Workers

## Getting Started

1. Clone the repository.
2. Deploy the Cloudflare Worker using `wrangler deploy`.
3. Configure your Supabase project and update `js/supabase-config.js`.
4. Access the application via your Worker URL.

## License

MIT
