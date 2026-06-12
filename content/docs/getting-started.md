+++
title = "Getting started"
weight = 1
+++

# Getting started

Three pieces: a **hub** anywhere both ends can reach, an **agent** on the
device that owns the CAN interfaces, a **client** wherever you are.

## 1. Run the hub

On a host with a public address (defaults: QUIC and TLS on 7227, plain TCP on
loopback 7228, a local unix socket for admin):

```sh
can-hub
```

## 2. Export the device buses

On the device. The TLS identity is generated on first start; the hub
fingerprint is pinned on first contact:

```sh
can-hub-agent --connect quic://hub.example.com:7227 --name truck42 can0 can1
```

## 3. Reach them from anywhere

```sh
$ can-hub-client --connect tls://hub.example.com:7227 list
id         agent                            interface
1          truck42                          can0
2          truck42                          can1

$ can-hub-client --connect tls://hub.example.com:7227 dump 1
(1780847295.078524) 123 [4] DE AD BE EF
```

`send` injects a frame, `attach` mirrors a remote bus into a local `vcan` so
candump, SavvyCAN, Wireshark or python-can work unmodified, and `socketcand`
runs a local bridge for legacy socketcand clients.

## Install

Debian packages and static binaries for x86_64/arm64/armv7 are published on
the [GitHub releases page](https://github.com/jamofer/can-hub/releases).
Building from source needs cmake, ninja and gcc — see the
[README](https://github.com/jamofer/can-hub#build).

## Administration

`can-hub-cli` manages the hub over its unix socket: agent identities and
pinning, per-interface read/write ACLs for clients, kicking peers, traffic
counters and remote interface configuration (bitrate, link up/down).
