// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IPreSale {
    function GetDefaultMaxAllowedPreSaleMint() external view returns (uint256);

    function SetDefaultMaxAllowedPreSaleMint(uint256 _maxAllowedPreSaleMint) external;

    function whiteListeNewAddress(address addr) external;

    function whiteListBunchAddresses(address[] memory addrs) external;

    function setMaxAllowPerAddress(address addr, uint256 _maxAllowed) external;

    function isAllowedForPresale(address addr) external view returns (uint256);
}