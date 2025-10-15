// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Hypercert.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HypercertEscrow is Ownable {
    Hypercert public hypercert;

    // ctor accepts hypercert address, and passes msg.sender to Ownable
    constructor(address _hypercert) Ownable(msg.sender) {
        hypercert = Hypercert(_hypercert);
    }

    // Owner (backend) can call this to release token from escrow to `to`
    function release(uint256 tokenId, address to) external onlyOwner {
        hypercert.safeTransferFrom(address(this), to, tokenId, 1, "");
    }

    // Accept ERC1155 tokens via safeTransferFrom to this contract
    function onERC1155Received(address, address, uint256, uint256, bytes memory) public pure returns(bytes4) {
        return this.onERC1155Received.selector;
    }
    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public pure returns(bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}

