// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Asset {
    uint256 public totalShare;
    uint256 public price; //asset price
    address public owner;

    struct ShareHolder {
        uint256 shares;
    }

    mapping(address => ShareHolder) public shareholders;

    event SharePurchased(address indexed buyer, uint256 amount);

    event Transfer(address indexed from, address indexed to, uint256 amount);

    // no need to store additional data it will take gas
    constructor(uint256 _price) {
        price = _price;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function buyShares(uint256 share) public payable {
        require(msg.value == price * share, "Not enough balance !");

        ShareHolder storage purchaser = shareholders[msg.sender];

        // if the buyer not already present in our mapping we will mark it as exists

        purchaser.shares += share;
        totalShare += share;
        payable(owner).transfer(price * share);
        
        //emit event when share purchased.

        emit SharePurchased(msg.sender, share);

        //emit event when amount is transfered.
        emit Transfer(msg.sender,owner,price*share);
    }
}
