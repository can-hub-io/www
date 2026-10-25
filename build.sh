#!/bin/sh
# Fetches the canonical docs from the code repository and builds the site.
# Used both by Cloudflare Pages (build command: ./build.sh) and CI.
set -eu

ZOLA_VERSION=0.19.2
CODE_RAW=https://raw.githubusercontent.com/can-hub-io/can-hub/main

if [ ! -x ./zola ] || ! ./zola --version | grep -q "$ZOLA_VERSION"; then
    curl -sfL "https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz" | tar xz
fi
ZOLA=./zola

# fetch_doc <repo_path> <title> <out.md> <weight> [description]
# Pulls a markdown doc from the code repo, prepends Zola front matter, and
# rewrites sibling `name.md` links to absolute `/docs/name/` site links; links
# to repo files the site does not publish point at GitHub, and GitHub's double
# hyphen for a dropped em dash in heading anchors becomes Zola's single one.
fetch_doc() {
    repo_path=$1; title=$2; out=$3; weight=$4; desc=${5:-}
    {
        printf '+++\ntitle = "%s"\nweight = %s\n' "$title" "$weight"
        [ -n "$desc" ] && printf 'description = "%s"\n' "$desc"
        printf '+++\n\n'
    } > "content/docs/$out"
    curl -sf "$CODE_RAW/$repo_path" \
        | sed 's#](\.\./python/README\.md#](/docs/python/#g' \
        | sed 's#](\.\./doc/\([a-z][a-z0-9-]*\)\.md#](/docs/\1/#g' \
        | sed 's#](\.\./#](https://github.com/can-hub-io/can-hub/blob/main/#g' \
        | sed 's#](\([a-z][a-z0-9-]*\)\.md#](/docs/\1/#g' \
        | sed 's|\(](/docs/[a-z-]*/#[a-z0-9-]*\)--|\1-|g' \
        | sed 's#](/docs/design/#](https://github.com/can-hub-io/can-hub/blob/main/doc/design.md#g' \
        >> "content/docs/$out"
}

# Guides
fetch_doc doc/quick-start.md  "Quick start"    quick-start.md  1 "First remote CAN frame in ten minutes — sandbox and real deployment."
fetch_doc doc/installation.md "Installation"   installation.md 2 "Debian packages, static binaries, the python wheel, building from source."
fetch_doc doc/security.md     "Security"       security.md     3 "Identities, TOFU pinning, agent allowlist, client read/write ACLs."
fetch_doc doc/transaction-scripts.md "Transaction scripts" transaction-scripts.md 4 "Request/response sequences the agent runs at its bus, checked before anything is sent."

# Tool reference
fetch_doc doc/hub.md     "can-hub"        hub.md     10 "The hub: listeners, identity, state, counters, limits."
fetch_doc doc/agent.md   "can-hub-agent"  agent.md   11 "The device daemon: exporting buses, service deployment, capabilities."
fetch_doc doc/client.md  "can-hub-client" client.md  12 "list, dump, send, attach vcan mirroring, the socketcand bridge."
fetch_doc doc/cli.md     "can-hub-cli"    cli.md     13 "Hub administration command reference."
fetch_doc doc/web.md     "can-hub-web"    web.md     14 "The web admin panel: install, users, permissions, REST API."

# Libraries
fetch_doc doc/libcanhub.md   "libcanhub"      libcanhub.md 15 "The embeddable C client library, Linux and Windows."
fetch_doc python/README.md   "python-can-hub" python.md    16 "Native python-can backend, transactions included."

# Internals
fetch_doc doc/protocol.md "Wire protocol"  protocol.md 20 "The wire protocol, version 0 — independent implementations welcome (CC-BY-4.0)."

# OpenAPI spec consumed by the Redoc-rendered API reference
curl -sf "$CODE_RAW/web/openapi.yaml" -o static/openapi.yaml

$ZOLA build
