// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ShoesNFT is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // tokenId를 key로, NFT의 해시 값을 value로 저장하는 매핑
    mapping(uint256 => bytes32) private _tokenHashes;
    mapping(uint256 => NFTMetadata) private _tokenMetadata;

    // NFT가 생성되었지만 주인이 없는 토큰 ID를 저장하는 배열
    uint256[] private _orphanedTokens;

    // NFT 에 관한 Metadata를 저장
    struct NFTMetadata {
        // NFT name
        string name;

        // price
        uint256 price;

        // point per step
        uint256 pps;

        // mileage per step
        uint256 mps;

        // Image URI
        string imageURI;
    }

    constructor() ERC721("ShoesNFT", "SNFT") {}

    // token hash를 계산합니다.
    function computeTokenHash(string memory attribute, string memory imageURI) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(attribute, imageURI));
    }

    // token 을 mint 합니다.
    function mint(
      // string memory tokenAttribute, 
      address to,
      string memory name,
      uint256 price,
      uint256 point_ratio,
      uint256 mileage_ratio,
      string memory tokenImageURI) public returns (uint256){
        _tokenIdCounter.increment();

        uint256 newTokenId = _tokenIdCounter.current();

        _safeMint(to, newTokenId);

        _tokenMetadata[newTokenId] = NFTMetadata(name, price, point_ratio, mileage_ratio, tokenImageURI);

        string memory nonce = Strings.toString(price + point_ratio + mileage_ratio);

        bytes32 tokenHash = computeTokenHash(nonce, tokenImageURI);

        _tokenHashes[newTokenId] = tokenHash;

        return newTokenId;
    }

    // 주어진 address가 소유한 NFT들의 tokenId 배열을 반환
    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        for(uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokens;
    }

    // getter, attribute
    function getNFTData(address owner) external view returns (NFTMetadata[] memory) {
        uint256[] memory tokens = tokensOfOwner(owner);

        NFTMetadata[] memory metadatas = new NFTMetadata[](tokens.length);

        for (uint256 i = 0; i < tokens.length; i++) {
            metadatas[i] = _tokenMetadata[tokens[i]];
        }

        return metadatas;
    }

    function getTokenPrice(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token ID does not exist");
        return _tokenMetadata[tokenId].price;
    }

    function getTokenPointRatio(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token ID does not exist");
        return _tokenMetadata[tokenId].pps;
    }

    function getTokenMileageRatio(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token ID does not exist");
        return _tokenMetadata[tokenId].mps;
    }

    function getTokenImageURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return _tokenMetadata[tokenId].imageURI;
    }

    // 주인이 없는 NFT의 tokenId 배열을 반환
    function getOrphanedTokens() external view returns (uint256[] memory) {
        return _orphanedTokens;
    }

    function setOrphanedToken(uint256 tokenId) internal {
        require(_exists(tokenId), "Token ID does not exist");
        _orphanedTokens.push(tokenId);
    }

    // 주어진 NFT의 해시 값을 반환
    function getTokenHash(uint256 tokenId) external view returns (bytes32) {
        require(_exists(tokenId), "Token ID does not exist");
        return _tokenHashes[tokenId];
    }
}

