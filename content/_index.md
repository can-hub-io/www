+++
title = "can-hub"
+++

# can-hub

CAN bus over the network, done right. Devices behind NAT export their
SocketCAN interfaces to a central hub over QUIC with mutual TLS; clients
anywhere consume them with the tools they already use.

- **Works through NAT and firewalls** — agents and clients dial out; the hub
  rendezvous in the middle.
- **Zero-config security** — identities generated on first start, pinned on
  first use, mutual TLS, per-interface read/write ACLs.
- **The right transport for CAN** — control on reliable streams, frames on
  latest-wins datagrams.
- **Your tools, unmodified** — mirror a remote bus into a local vcan, or keep
  using socketcand clients through the bridge.

## Get it

Source, releases and issues: [github.com/jamofer/can-hub](https://github.com/jamofer/can-hub)

## Documentation

- [Getting started](/docs/getting-started/)
- [Wire protocol](/docs/protocol/)
- [Design](/docs/design/)

## License

AGPL-3.0, with a [commercial license](mailto:licensing@can-hub.io) for
proprietary integrations. Protocol spec is CC-BY-4.0.
