#!/bin/sh
# G2G Web Startup Script
# Handles both Docker and local standalone deployments

set -e

# Find server.js in standalone output
if [ -f "./server.js" ]; then
    # Docker build (flat structure) or properly configured standalone
    exec node server.js
elif [ -f ".next/standalone/server.js" ]; then
    # Local build with flat standalone
    exec node .next/standalone/server.js
else
    # Find server.js in nested standalone structure (Next.js preserves full paths)
    SERVER_JS=$(find .next/standalone -name "server.js" -type f 2>/dev/null | grep -E "g2g-web/server\.js$" | head -1)
    if [ -n "$SERVER_JS" ]; then
        exec node "$SERVER_JS"
    else
        # Fallback: try to find any server.js
        SERVER_JS=$(find .next/standalone -name "server.js" -type f 2>/dev/null | head -1)
        if [ -n "$SERVER_JS" ]; then
            exec node "$SERVER_JS"
        fi
    fi
fi

echo "Error: Could not find server.js in standalone output"
exit 1
