#!/bin/sh
# Fetches the canonical docs from the code repository and builds the site.
# Used both by Cloudflare Pages (build command: ./build.sh) and CI.
set -eu

ZOLA_VERSION=0.19.2
CODE_RAW=https://raw.githubusercontent.com/jamofer/can-hub/main

if [ ! -x ./zola ] || ! ./zola --version | grep -q "$ZOLA_VERSION"; then
    curl -sfL "https://github.com/getzola/zola/releases/download/v${ZOLA_VERSION}/zola-v${ZOLA_VERSION}-x86_64-unknown-linux-gnu.tar.gz" | tar xz
fi
ZOLA=./zola

fetch_doc() {
    repo_path=$1; title=$2; out=$3; weight=$4
    printf '+++\ntitle = "%s"\nweight = %s\n+++\n\n' "$title" "$weight" > "content/docs/$out"
    curl -sf "$CODE_RAW/$repo_path" >> "content/docs/$out"
}

fetch_doc doc/protocol.md "Wire protocol" protocol.md 2
fetch_doc doc/design.md "Design" design.md 3

$ZOLA build
