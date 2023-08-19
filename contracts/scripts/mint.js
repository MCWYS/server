const {ethers, hre} = require("hardhat");

const CTRT_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const NFT_OWNER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

async function main() {
  console.log("[check] Contract address:", CTRT_ADDR);
  
  const nft = await ethers.getContractAt("ShoesNFT", CTRT_ADDR);

  // let price = 10;
  // let point_ratio = 100;
  // let mileage_ratio = 100;
  // let image_uri = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSmiley&psig=AOvVaw0TVo4C4bT3uyGpu6m7OKQy&ust=1692518712837000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCPCO_9ah6IADFQAAAAAdAAAAABAE";

  // mint
  await nft.mint(NFT_OWNER, 10, 100, 100, "0");
  await nft.mint(NFT_OWNER, 11, 101, 101, "1");
  await nft.mint(NFT_OWNER, 12, 102, 102, "2");
  await nft.mint(NFT_OWNER, 13, 103, 103, "3");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
