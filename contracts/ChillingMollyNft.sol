// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error NotEnoughEthSent();
error ChillingMollyNfT__TransferFailed();

contract ChillingMollyNft is ERC721, Ownable {
    uint256 private s_tokenCounter;
    string private TOKEN_URI;
    uint256 private immutable i_mintFee;

    constructor(string memory tokenUri, uint256 mintFee) ERC721("Chilling Molly", "Cat") {
        s_tokenCounter = 0;
        TOKEN_URI = tokenUri;
        i_mintFee = mintFee;
    }

    function mintNft() public payable returns (uint256) {
        if (msg.value < i_mintFee) {
            revert NotEnoughEthSent();
        }
        s_tokenCounter = s_tokenCounter + 1;
        _safeMint(msg.sender, s_tokenCounter);

        return s_tokenCounter;
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert ChillingMollyNfT__TransferFailed();
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }
}
