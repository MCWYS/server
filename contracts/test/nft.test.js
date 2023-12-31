const { expect } = require("chai");

describe("ShoesNFT", function() {
    let ShoesNFT, shoesNFT;
    let owner, addr1;
    let ownerAddress, addr1Address;

    beforeEach(async function() {
        ShoesNFT = await ethers.getContractFactory("ShoesNFT");
        [owner, addr1] = await ethers.getSigners();
        ownerAddress = await owner.getAddress();
        addr1Address = await addr1.getAddress();

        shoesNFT = await ShoesNFT.deploy();
        // await shoesNFT.deployed();
    });

    describe("Minting, querying and metadata", function() {
        it("Should mint a new NFT with metadata", async function() {
            await shoesNFT.connect(owner).mint(ownerAddress, "Watermelon", 10, 100, 100, "testImageURI");
            const tokenOwner = await shoesNFT.ownerOf(1);
            expect(tokenOwner).to.equal(ownerAddress);

            const tokenPrice = await shoesNFT.getTokenPrice(1);
            expect(tokenPrice.toString()).to.equal("10");

            const tokenPointRatio = await shoesNFT.getTokenPointRatio(1);
            expect(tokenPointRatio.toString()).to.equal("100");

            const tokenMileageRatio = await shoesNFT.getTokenMileageRatio(1);
            expect(tokenMileageRatio.toString()).to.equal("100");

            const tokenImageURI = await shoesNFT.getTokenImageURI(1);
            expect(tokenImageURI).to.equal("testImageURI");
        });

        it("Should return tokens of owner", async function() {
            await shoesNFT.connect(owner).mint(ownerAddress, "Watermelon", 10, 100, 100, "testImageURI1");
            await shoesNFT.connect(owner).mint(ownerAddress, "Slapper", 20, 200, 200, "testImageURI2");
            
            const ownerTokens = await shoesNFT.tokensOfOwner(ownerAddress);
            const addr1Tokens = await shoesNFT.tokensOfOwner(addr1Address);

            expect(ownerTokens.length).to.equal(2);
            expect(addr1Tokens.length).to.equal(0);
        });

        it("Should return token hash", async function() {
            await shoesNFT.connect(owner).mint(ownerAddress, "Watermelon", 10, 100, 100, "testImageURI1");
            const tokenHash = await shoesNFT.getTokenHash(1);
            expect(tokenHash).to.equal("0x27dff494b308b8f8b49e2d87e4f22a0e507f586e88ad67180098f672ce6a7d5a");
        });
        
        it("Should return correct metadata for tokens", async function() {
            await shoesNFT.connect(owner).mint(ownerAddress,"Watermelon",  10, 100, 100, "testImageURI1");
            await shoesNFT.connect(owner).mint(ownerAddress,"Slapper",  20, 200, 200, "testImageURI2");

            const token1Price = await shoesNFT.getTokenPrice(1);
            expect(token1Price.toString()).to.equal("10");

            const token1PointRatio = await shoesNFT.getTokenPointRatio(1);
            expect(token1PointRatio.toString()).to.equal("100");

            const token1MileageRatio = await shoesNFT.getTokenMileageRatio(1);
            expect(token1MileageRatio.toString()).to.equal("100");

            const token1ImageURI = await shoesNFT.getTokenImageURI(1);
            expect(token1ImageURI).to.equal("testImageURI1");

            const token2Price= await shoesNFT.getTokenPrice(2);
            expect(token2Price.toString()).to.equal("20");

            const token2PointRatio = await shoesNFT.getTokenPointRatio(2);
            expect(token2PointRatio.toString()).to.equal("200");

            const token2MileageRatio = await shoesNFT.getTokenMileageRatio(2);
            expect(token2MileageRatio.toString()).to.equal("200");

            const token2ImageURI = await shoesNFT.getTokenImageURI(2);
            expect(token2ImageURI).to.equal("testImageURI2");
        });
    });

    describe("Querying", function() {
        it("Should show valueable json", async function() {
            await shoesNFT.connect(owner).mint(ownerAddress, "Watermelon", 10, 11, 7, "testImageURI1");
            await shoesNFT.connect(owner).mint(ownerAddress, "Slapper", 20, 3, 4, "testImageURI2");
            await shoesNFT.connect(owner).mint(ownerAddress, "Chocp Cream", 30, 3, 3, "testImageURI3");
            await shoesNFT.connect(owner).mint(ownerAddress, "Reddy", 40, 3, 4, "testImageURI4");
            await shoesNFT.connect(owner).mint(ownerAddress, "Milki way", 50, 5, 3, "testImageURI5");
            
            // const ownerTokens = await shoesNFT.tokensOfOwner(ownerAddress);

            const res = await shoesNFT.getNFTData(ownerAddress);

            function transformNFTData(data) {
              const shoes = data.map(item => ({
                name: item.name, // 현재 데이터에 신발의 이름에 대한 정보가 없기 때문에 임시로 imageURI를 이름으로 사용했습니다.
                mps: item[2].toString(), // BigNumber 값을 문자열로 변환
                pps: item[1].toString(),  // BigNumber 값을 문자열로 변환
                price: item[3].toString(),
                imageURI: item.imageURI, // 현재 데이터에 신발의 이름에 대한 정보가 없기 때문에 임시로 imageURI를 이름으로 사용했습니다.
              }));

              return {
                name: "JamJam", // 현재 데이터에는 name과 mileage에 대한 정보가 없기 때문에 임의의 값으로 설정했습니다.
                mileage: "2300",
                shoes
              };
            }

            const NFTdata = transformNFTData(res);
            console.log(NFTdata);

            // console.log(typeof(res));
            // console.log(JSON.stringify(res));
            // console.log(res);
        });
    });
});

