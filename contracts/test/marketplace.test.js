const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
    let NFTMarketplace, marketplace, owner, addr1, addr2;
    let ownerAddress;

    beforeEach(async function () {

        ShoesNFT = await ethers.getContractFactory("ShoesNFT");
        shoesNFT = await ShoesNFT.deploy();

        NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        marketplace = await NFTMarketplace.deploy();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("Should list and buy an NFT", async function () {
        // Mint an NFT to addr1
        await shoesNFT.mint(owner.address, "Watermelon", 10, 11, 7, "testImageURI1");

        // Approve marketplace to transfer NFT on behalf of addr1
        await shoesNFT.approve(marketplace.address, 1);

        // List NFT for sale
        await marketplace.connect(owner).listNFT(shoesNFT.address, 1, ethers.utils.parseEther("1"));

        // addr2 buys the NFT
        await marketplace.connect(addr2).buyNFT(1, { value: ethers.utils.parseEther("1") });

        // Confirm ownership transfer to addr2
        expect(await shoesNFT.ownerOf(1)).to.equal(addr2.address);
    });

    it("Should fail if trying to buy without enough ether", async function () {
        // Mint an NFT to addr1
        await shoesNFT.mint(owner.address, "Watermelon", 10, 11, 7, "testImageURI1");

        // Approve marketplace to transfer NFT on behalf of addr1
        await shoesNFT.approve(marketplace.address, 1);

        // List NFT for sale
        await marketplace.connect(owner).listNFT(shoesNFT.address, 1, ethers.utils.parseEther("1"));

        // Expect a revert because not enough Ether sent
        await expect(marketplace.connect(addr2).buyNFT(1, { value: ethers.utils.parseEther("0.5") })).to.be.reverted;
    });

    it("Should get listed NFT", async function () {
        // Mint an NFT to addr1
        await shoesNFT.connect(owner).mint(owner.address, "Watermelon", 10, 11, 7, "testImageURI1");
        await shoesNFT.connect(owner).mint(owner.address, "Slapper", 20, 3, 4, "testImageURI2");
        await shoesNFT.connect(owner).mint(owner.address, "Chocp Cream", 30, 3, 3, "testImageURI3");
        await shoesNFT.connect(owner).mint(owner.address, "Reddy", 40, 3, 4, "testImageURI4");

        // Approve marketplace to transfer NFT on behalf of addr1
        await shoesNFT.connect(owner).approve(marketplace.address, 1);
        await shoesNFT.connect(owner).approve(marketplace.address, 2);
        await shoesNFT.connect(owner).approve(marketplace.address, 3);
        await shoesNFT.connect(owner).approve(marketplace.address, 4);

        // List NFT for sale
        await marketplace.connect(owner).listNFT(shoesNFT.address, 1, ethers.utils.parseEther("11"));
        await marketplace.connect(owner).listNFT(shoesNFT.address, 2, ethers.utils.parseEther("22"));
        await marketplace.connect(owner).listNFT(shoesNFT.address, 3, ethers.utils.parseEther("33"));
        await marketplace.connect(owner).listNFT(shoesNFT.address, 4, ethers.utils.parseEther("44"));


        // console.log(await marketplace.getListing(1));
        // console.log(await marketplace.getListing(2));
        // console.log(await marketplace.getListing(3));
        // console.log(await marketplace.getListing(4));
    });
});

