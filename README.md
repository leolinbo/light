# ENCORE Coremail Mail-MCP

This repository is the deployment workspace for connecting ChatGPT to ENCORE's Coremail mailbox through Mail-MCP.

## Target mailbox

- SMTP host: c2.icoremail.net
- SMTP port: 465
- SMTP TLS mode: implicit SSL/TLS
- From: sales21@encore-tech.com

Never commit the mailbox password, MCP tunnel API key, or confirmation signing secret.

## Bootstrap

1. Open GitHub Actions.
2. Run **Bootstrap Mail-MCP** manually.
3. After the upstream source is imported, follow the Mail-MCP/OpenAI Secure MCP Tunnel setup.
4. Put credentials only in .env.local or the runtime secret store.

The upstream project supports SMTP 465 with SMTP_SECURE=true and provides a ChatGPT-compatible MCP endpoint.
