// ~/opinabox/contracts/scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", await deployer.getAddress());

  const Hypercert = await hre.ethers.getContractFactory("Hypercert");
  const hypercert = await Hypercert.deploy();
  // wait for deployment (ethers v6)
  await hypercert.waitForDeployment();
  const hypercertAddr = await hypercert.getAddress();
  console.log("Hypercert deployed at:", hypercertAddr);

  const Escrow = await hre.ethers.getContractFactory("HypercertEscrow");
  const escrow = await Escrow.deploy(hypercertAddr);
  await escrow.waitForDeployment();
  const escrowAddr = await escrow.getAddress();
  console.log("Escrow deployed at:", escrowAddr);

  // Mint a demo token to escrow (the deployer is owner because we used Ownable(msg.sender))
  const tx = await hypercert.mint(escrowAddr, "ipfs://example-metadata");
  const receipt = await tx.wait();
  console.log("Minted demo token to escrow. tx:", receipt.transactionHash);

  // Print summary
  console.log("=== Deployment complete ===");
  console.log("Hypercert:", hypercertAddr);
  console.log("Escrow:   ", escrowAddr);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
