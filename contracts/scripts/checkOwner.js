const { ethers } = require("hardhat");

async function main() {
  const tokenId = process.argv[2];
  if (!tokenId) {
    console.error("Usage: node scripts/checkOwner.js <tokenId>");
    process.exit(1);
  }

  const network = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(network);
  const artifacts = require("../artifacts/contracts/Hypercert.sol/Hypercert.json");
  // replace with deployed address from deploy output
  const hypercertAddr = process.env.HYPERCERT_ADDR;
  if (!hypercertAddr) {
    console.error("Set HYPERCERT_ADDR env var to the deployed Hypercert contract address");
    process.exit(1);
  }

  const hypercert = new ethers.Contract(hypercertAddr, artifacts.abi, provider);
  // There's no ownerOf in ERC1155, but we can check balanceOf
  // For demo assume tokenId is a single-supply token
  // Replace <address> with claimant address to check balance
  console.log("Querying balances for tokenId", tokenId);
  // This prints balances for first 3 accounts for demo
  const accounts = await provider.send("eth_accounts", []);
  for (let i = 0; i < Math.min(3, accounts.length); i++) {
    const bal = await hypercert.balanceOf(accounts[i], tokenId);
    console.log(accounts[i], "balance:", bal.toString());
  }
}

main().catch(e => { console.error(e); process.exit(1); });
