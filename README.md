# Hyperleaks — “OnionPress in a Box”

**A self-contained dev/demo stack** for anonymous (Tor-routed) publishing + minting Hypercerts from a browser VDI.

> Spin up the stack with Docker Compose, open the Kasm/noVNC VDI, use the toolbar to **Publish & Mint** (creates an ephemeral wallet, mints a Hypercert to it, shows a QR/seed), then reclaim the token later by importing the ephemeral key or calling the control API.

---
## Key components — what they are (quick links)

- **Hypercert** — [Hypercerts](https://hypercerts.org/) (and the related GitHub org) are a model and set of smart-contract primitives for representing *credits* (non-fungible or semi-fungible tokens) that capture contributions, claims, and value in digital public goods and funding systems. In this project a **Hypercert** is the on-chain token minted to an ephemeral address to represent the published article and the associated claim.  
  - Learn more: https://hypercerts.org/ · GitHub org: https://github.com/hypercerts

- **Kasm Workspace (noVNC VDI)** — [Kasm Workspaces](https://www.kasmweb.com/) is a commercial/open-source-style VDI (virtual desktop infrastructure) solution that provides browser-accessible containerized desktops and browser sandboxes. In this demo we run a lightweight noVNC-based workspace container that exposes a small toolbar UI — the journalist uses the browser-accessible VDI to author/publish while the underlying container enforces isolation from the public endpoint.  
  - Learn more / Kasm: https://www.kasmweb.com/ · noVNC: https://github.com/novnc/noVNC

---

## Acknowledgements

This project builds on ideas and prototype work from the *Onion Press* concept. Special thanks and attribution to the original Onion Press repo and author:

- **Onion Press (inspiration)** — vpavlin / onion-press. See: https://github.com/vpavlin/onion-press
- **Internet Archive** — [Internet Archive](https://archive.org/) is a non-profit digital library offering long-term archiving of web pages, books, audio, and other digital artifacts. The OnionPress concept (and this demo) intends to use archival mirrors (Internet Archive or similar) as persistent publication endpoints so that a journalist’s work can be preserved and referenced by the minted Hypercert metadata.  
  - Learn more: https://archive.org/

## Table of contents

- [Project overview](#project-overview)  
- [Quick prerequisites](#quick-prerequisites)  
- [Repository layout & important files](#repository-layout--important-files)  
- [Quick start (dev) — run the whole stack](#quick-start-dev---run-the-whole-stack)  
- [VDI / toolbar: how to use it (MVP acceptance test)](#vdi--toolbar-how-to-use-it-mvp-acceptance-test)  
- [Developer flows: minting, retrieving ephemeral key, claiming / transferring token](#developer-flows-minting-retrieving-ephemeral-key-claiming--transferring-token)  
- [Common issues & troubleshooting](#common-issues--troubleshooting)  
- [Security, production notes & hardening checklist](#security-production-notes--hardening-checklist)  
- [Committing & sharing your changes](#committing--sharing-your-changes)  
- [Where to edit the toolbar UI](#where-to-edit-the-toolbar-ui)  
- [Quick commands cheat sheet](#quick-commands-cheat-sheet)  
- [Contributing & license](#contributing--license)

---

## Project overview

OnionPress-in-a-box is a minimal local stack demonstrating the RealFi / Funding-the-Commons idea:

- A **Kasm-style VDI** (noVNC) workspace runs in a container (`workspace`) with a small toolbar UI (`toolbar.html`, `toolbar.js`, `toolbar.css`) under `/opt/onionpress/`.
- The toolbar can create an **ephemeral wallet**, publish article metadata, and request minting via `control-api`.
- `control-api` is a Node/Express service that talks to:
  - a local Ethereum test node (Hardhat) for contract interactions,
  - Redis for storing short-lived claim records (dev flow),
  - and optionally admin UI components.
- `Hypercert` / `HypercertEscrow` contracts are provided under `contracts/` and deployed to the local Hardhat node.
- A local Tor proxy container is used to route VDI traffic over Tor. Workspace apps can connect to the proxy via SOCKS.

**Important:** this repo is an MVP/demo. Many production security features are intentionally simplified or missing for development convenience.

---

## Quick prerequisites

Install on the host where you will run Docker Compose:

- Docker & Docker Compose v2 (latest stable recommended)  
- Git (SSH configured or HTTPS + PAT)  
- Optional: `jq` for JSON inspection, `npx`/Node (if running local hardhat tasks from host)

> If containers fail to fetch packages/compilers inside the build, check host networking and Docker DNS.

---

## Repository layout & important files
 .
├─ docker-compose.yml # Compose for redis, control-api, workspace, torproxy, hardhat
├─ kasm-workspace/
│ └─ opt/onionpress/
│ ├─ toolbar.html # UI page for Publish & Mint
│ ├─ toolbar.js # client script — ephemeral wallet + POST /mint
│ └─ toolbar.css # styles
├─ control-api/ # express app (index.js), Redis usage
├─ contracts/ # solidity contracts, hardhat config, deploy scripts
├─ docker/ # Dockerfiles, workspace Dockerfile, start scripts
└─ README.md
