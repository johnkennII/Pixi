// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./IPreSale.sol";

contract PreSale is IPreSale,
    Initializable, 
    OwnableUpgradeable, 
    UUPSUpgradeable,
    AccessControlUpgradeable
{
    uint256 private constant VERSION = 1;
    uint256 private maxAllowedPreSaleMint;
    mapping(address => uint256) private whiteListedAddress;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __Ownable_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        maxAllowedPreSaleMint = 3;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}

    function contractVersion() external pure returns (uint8) {
        return uint8(VERSION);
    }

    function GetDefaultMaxAllowedPreSaleMint() override external view returns (uint256) {
      return maxAllowedPreSaleMint;
    }

    function SetDefaultMaxAllowedPreSaleMint(uint256 _maxAllowedPreSaleMint) override public onlyOwner {
      maxAllowedPreSaleMint = _maxAllowedPreSaleMint;
    }

    function whiteListeNewAddress(address addr) override public onlyOwner {
        whiteListedAddress[addr] = maxAllowedPreSaleMint;
    }

    function whiteListBunchAddresses(address[] memory addrs) override public onlyOwner {
        uint256 totalNewAddr = addrs.length;
        for (uint i=0; i < totalNewAddr; i++){
            whiteListedAddress[addrs[i]] = maxAllowedPreSaleMint;
        }
    }

    function setMaxAllowPerAddress(address addr, uint256 _maxAllowed) override public onlyOwner{
        whiteListedAddress[addr] = _maxAllowed;
    }

    function isAllowedForPresale(address addr) override public view returns (uint256){
        return whiteListedAddress[addr];
    }
}