// const hre = require("hardhat");

async function main() {
  [owner, addr1, addr2] = await ethers.getSigners();

  const nftFactory= await ethers.getContractFactory("ShoesNFT");

  const nft = await nftFactory.connect(addr1).deploy();

  const ctrt_addr = nft.address;
  
  console.log("[+] Contract address:", ctrt_addr);

  await nft.mint(owner.address, "Watermelon", 10, 100, 100, "0");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
