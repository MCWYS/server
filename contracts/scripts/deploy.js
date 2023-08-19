const hre = require("hardhat");

async function main() {
  const nftFactory= await ethers.getContractFactory("ShoesNFT");

  const nft = await nftFactory.deploy();

  const ctrt_addr = nft.target;
  
  console.log("[+] Contract address:", ctrt_addr);

  // await MyToken.mint(deployer.address, 50);
  // let owner_balance = await MyToken.balanceOf(deployer.address);
  // console.log("owner_balance: ", owner_balance);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
