// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PredictToken.sol";

contract TokenFaucet is Ownable, ReentrancyGuard {
    PredictToken public token;
    uint256 public claimAmount = 100 * 10**18; // 100 tokens
    uint256 public cooldownPeriod = 24 hours;
    
    mapping(address => uint256) public lastClaimTime;
    
    event TokensClaimed(address indexed user, uint256 amount);
    
    constructor(address _token, address _owner) Ownable(_owner) {
        token = PredictToken(_token);
    }
    
    function claimTokens() external nonReentrant {
        require(
            lastClaimTime[msg.sender] + cooldownPeriod < block.timestamp,
            "Cooldown period not over"
        );
        
        lastClaimTime[msg.sender] = block.timestamp;
        token.mint(msg.sender, claimAmount);
        
        emit TokensClaimed(msg.sender, claimAmount);
    }
    
    function setClaimAmount(uint256 _amount) external onlyOwner {
        claimAmount = _amount;
    }
    
    function setCooldownPeriod(uint256 _period) external onlyOwner {
        cooldownPeriod = _period;
    }
}