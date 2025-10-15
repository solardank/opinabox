// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Hypercert is ERC1155, Ownable {
    uint256 public nextId;
    mapping(uint256 => string) public uriOf;

    // Pass msg.sender to Ownable constructor and provide an ERC1155 URI (empty ok)
    constructor() ERC1155("") Ownable(msg.sender) {
        nextId = 1;
    }

    function mint(address to, string calldata metadataURI) external onlyOwner returns (uint256) {
        uint256 id = nextId++;
        _mint(to, id, 1, "");
        uriOf[id] = metadataURI;
        return id;
    }

    function uri(uint256 id) public view override returns (string memory) {
        return uriOf[id];
    }
}

