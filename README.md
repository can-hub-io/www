# can-hub.io

Website for [can-hub](https://github.com/jamofer/can-hub), built with
[Zola](https://www.getzola.org) and deployed on Cloudflare Pages.

```sh
./build.sh            # fetches canonical docs from the code repo, builds into public/
./zola serve          # local preview (after a first ./build.sh)
```

`doc/protocol.md` and `doc/design.md` are pulled from the code repository at
build time — edit them there, never here.

Site content: CC-BY-4.0. Code (templates/styles): MIT.
