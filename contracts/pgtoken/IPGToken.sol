// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";


interface IPGToken is ERC721Upgradeable {
    function safeMint(string memory uri) external returns(uint256);

    function tokenURI(uint256 tokenId) external view returns (string memory);
}