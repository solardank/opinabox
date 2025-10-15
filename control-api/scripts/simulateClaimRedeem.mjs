// simulateClaimRedeem.mjs (ESM)
// Usage: set env vars CLAIM_CODE and CLAIMANT_PRIV and CONTROL_API, then run:
//   node control-api/scripts/simulateClaimRedeem.mjs

import { Wallet } from "ethers";

const CONTROL_API = process.env.CONTROL_API || "http://127.0.0.1:3000";
const C = process.env.CLAIM_CODE;
const CLAIMANT_PRIV = process.env.CLAIMANT_PRIV;

if (!C || !CLAIMANT_PRIV) {
  console.error("Set CLAIM_CODE and CLAIMANT_PRIV environment variables");
  process.exit(1);
}

(async () => {
  try {
    const w = new Wallet(CLAIMANT_PRIV); // local wallet for signing
    const message = `claim:${C}`;
    const signature = await w.signMessage(message);
    console.log("Claimant address:", w.address);
    console.log("Signature:", signature);

    // use global fetch (Node 18+ has fetch)
    const res = await fetch(`${CONTROL_API}/claim/redeem`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ c: C, signature })
    });
    const body = await res.text();
    try { console.log("Response:", JSON.parse(body)); }
    catch(e) { console.log("Response (raw):", body); }
  } catch (err) {
    console.error("Script error:", err);
    process.exit(1);
  }
})();

