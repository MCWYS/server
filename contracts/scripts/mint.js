const {ethers, hre} = require("hardhat");

const CTRT_ADDR = "0x8464135c8F25Da09e49BC8782676a84730C318bC"
// const NFT_OWNER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

async function main() {
  [owner, addr1, addr2] = await ethers.getSigners();
  console.log("[check] Contract address:", CTRT_ADDR);
  
  const nft = await ethers.getContractAt("ShoesNFT", CTRT_ADDR);

  // mint
  await nft.mint(owner.address, "Watermelon", 10, 100, 100, "0");
  await nft.mint(owner.address, "Cherry", 11, 101, 101, "1");
  await nft.mint(owner.address, "Green Day", 12, 102, 102, "2");
  await nft.mint(owner.address, "Worker", 13, 103, 103, "3");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
