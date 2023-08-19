// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is IERC721Receiver, ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    struct Listing {
        uint256 tokenId;
        address tokenAddress;
        address payable seller;
        uint256 price;
        bool isListed;
    }

    // TokenID -> Listing
    mapping(uint256 => Listing) private listings;

    event NFTListed(uint256 indexed tokenId, address indexed tokenAddress, address indexed seller, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId, address indexed tokenAddress);
    event NFTSold(uint256 indexed tokenId, address indexed tokenAddress, address buyer, address seller, uint256 price);

    function listNFT(address tokenAddress, uint256 tokenId, uint256 price) external nonReentrant {
        require(IERC721(tokenAddress).ownerOf(tokenId) == msg.sender, "Not the owner of the token");
        require(IERC721(tokenAddress).getApproved(tokenId) == address(this), "Marketplace not approved to transfer token");

        listings[tokenId] = Listing({
            tokenId: tokenId,
            tokenAddress: tokenAddress,
            seller: payable(msg.sender),
            price: price,
            isListed: true
        });

        emit NFTListed(tokenId, tokenAddress, msg.sender, price);
    }

    function unlistNFT(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.seller == msg.sender, "Not the owner of the token");
        listing.isListed = false;
        emit NFTUnlisted(tokenId, listing.tokenAddress);
    }

    function buyNFT(uint256 tokenId) external payable nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.isListed, "Token is not listed");
        require(msg.value == listing.price, "Incorrect Ether sent");

        // Transfer the NFT to the buyer
        IERC721(listing.tokenAddress).safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Transfer the money to the seller
        listing.seller.transfer(msg.value);

        emit NFTSold(tokenId, listing.tokenAddress, msg.sender, listing.seller, listing.price);

        // Remove the listing
        delete listings[tokenId];
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns(bytes4) {
        return this.onERC721Received.selector;
    }

    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }
}

