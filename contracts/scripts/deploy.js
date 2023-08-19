const hre = require("hardhat");

async function main() {
  const nftFactory= await ethers.getContractFactory("ShoesNFT");

  const nft = await nftFactory.deploy();

  const ctrt_addr = nft.address;
  
  console.log("[+] Contract address:", ctrt_addr);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
