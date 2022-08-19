// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ChillingMollyNft is ERC721 {
    uint256 private s_tokenCounter;
    string private TOKEN_URI;

    constructor(string memory tokenUri) ERC721("Chilling Molly", "Cat") {
        s_tokenCounter = 0;
        TOKEN_URI = tokenUri;
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
        return s_tokenCounter;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
