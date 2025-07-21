// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PredictionMarket is Ownable, ReentrancyGuard {
    IERC20 public immutable token;
    
    enum MarketOutcome { PENDING, OPTION_A, OPTION_B }
    
    struct Market {
        string question;
        string optionA;
        string optionB;
        uint256 endTime;
        MarketOutcome outcome;
        uint256 totalOptionAShares;
        uint256 totalOptionBShares;
        bool resolved;
    }
    
    struct UserPosition {
        uint256 optionAShares;
        uint256 optionBShares;
    }
    
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => UserPosition)) public userPositions;
    uint256 public marketCount;
    
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        string optionA,
        string optionB,
        uint256 endTime
    );
    
    event SharesPurchased(
        uint256 indexed marketId,
        address indexed user,
        bool isOptionA,
        uint256 amount,
        uint256 shares
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        MarketOutcome outcome
    );
    
    event RewardsClaimed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );
    
    constructor(address _token, address _owner) Ownable(_owner) {
        token = IERC20(_token);
    }
    
    function createMarket(
        string calldata _question,
        string calldata _optionA,
        string calldata _optionB,
        uint256 _duration
    ) external onlyOwner {
        require(bytes(_question).length > 0, "Question cannot be empty");
        require(bytes(_optionA).length > 0, "Option A cannot be empty");
        require(bytes(_optionB).length > 0, "Option B cannot be empty");
        require(_duration > 0, "Duration must be positive");
        
        uint256 marketId = marketCount;
        uint256 endTime = block.timestamp + _duration;
        
        markets[marketId] = Market({
            question: _question,
            optionA: _optionA,
            optionB: _optionB,
            endTime: endTime,
            outcome: MarketOutcome.PENDING,
            totalOptionAShares: 0,
            totalOptionBShares: 0,
            resolved: false
        });
        
        marketCount++;
        
        emit MarketCreated(marketId, _question, _optionA, _optionB, endTime);
    }
    
    function buyShares(
        uint256 _marketId,
        bool _isOptionA,
        uint256 _amount
    ) external nonReentrant {
        require(_marketId < marketCount, "Market does not exist");
        require(_amount > 0, "Amount must be positive");
        
        Market storage market = markets[_marketId];
        require(block.timestamp < market.endTime, "Market has ended");
        require(!market.resolved, "Market is resolved");
        
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Token transfer failed"
        );
        
        UserPosition storage position = userPositions[_marketId][msg.sender];
        
        if (_isOptionA) {
            position.optionAShares += _amount;
            market.totalOptionAShares += _amount;
        } else {
            position.optionBShares += _amount;
            market.totalOptionBShares += _amount;
        }
        
        emit SharesPurchased(_marketId, msg.sender, _isOptionA, _amount, _amount);
    }
    
    function resolveMarket(
        uint256 _marketId,
        MarketOutcome _outcome
    ) external onlyOwner {
        require(_marketId < marketCount, "Market does not exist");
        require(_outcome != MarketOutcome.PENDING, "Invalid outcome");
        
        Market storage market = markets[_marketId];
        require(block.timestamp >= market.endTime, "Market has not ended");
        require(!market.resolved, "Market already resolved");
        
        market.outcome = _outcome;
        market.resolved = true;
        
        emit MarketResolved(_marketId, _outcome);
    }
    
    function claimRewards(uint256 _marketId) external nonReentrant {
        require(_marketId < marketCount, "Market does not exist");
        
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved");
        
        UserPosition storage position = userPositions[_marketId][msg.sender];
        
        uint256 winningShares = 0;
        uint256 totalWinningShares = 0;
        
        if (market.outcome == MarketOutcome.OPTION_A) {
            winningShares = position.optionAShares;
            totalWinningShares = market.totalOptionAShares;
        } else if (market.outcome == MarketOutcome.OPTION_B) {
            winningShares = position.optionBShares;
            totalWinningShares = market.totalOptionBShares;
        }
        
        require(winningShares > 0, "No winning shares");
        
        uint256 totalPool = market.totalOptionAShares + market.totalOptionBShares;
        uint256 reward = (winningShares * totalPool) / totalWinningShares;
        
        position.optionAShares = 0;
        position.optionBShares = 0;
        
        require(token.transfer(msg.sender, reward), "Reward transfer failed");
        
        emit RewardsClaimed(_marketId, msg.sender, reward);
    }
    
    function getMarketInfo(uint256 _marketId) 
        external 
        view 
        returns (
            string memory question,
            string memory optionA,
            string memory optionB,
            uint256 endTime,
            uint8 outcome,
            uint256 totalOptionAShares,
            uint256 totalOptionBShares,
            bool resolved
        ) 
    {
        require(_marketId < marketCount, "Market does not exist");
        Market storage market = markets[_marketId];
        
        return (
            market.question,
            market.optionA,
            market.optionB,
            market.endTime,
            uint8(market.outcome),
            market.totalOptionAShares,
            market.totalOptionBShares,
            market.resolved
        );
    }
    
    function getSharesBalance(uint256 _marketId, address _user) 
        external 
        view 
        returns (uint256 optionAShares, uint256 optionBShares) 
    {
        require(_marketId < marketCount, "Market does not exist");
        UserPosition storage position = userPositions[_marketId][_user];
        return (position.optionAShares, position.optionBShares);
    }
    
    function getUserReward(uint256 _marketId, address _user) 
        external 
        view 
        returns (uint256 reward) 
    {
        require(_marketId < marketCount, "Market does not exist");
        
        Market storage market = markets[_marketId];
        if (!market.resolved) return 0;
        
        UserPosition storage position = userPositions[_marketId][_user];
        
        uint256 winningShares = 0;
        uint256 totalWinningShares = 0;
        
        if (market.outcome == MarketOutcome.OPTION_A) {
            winningShares = position.optionAShares;
            totalWinningShares = market.totalOptionAShares;
        } else if (market.outcome == MarketOutcome.OPTION_B) {
            winningShares = position.optionBShares;
            totalWinningShares = market.totalOptionBShares;
        }
        
        if (winningShares == 0 || totalWinningShares == 0) return 0;
        
        uint256 totalPool = market.totalOptionAShares + market.totalOptionBShares;
        return (winningShares * totalPool) / totalWinningShares;
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner(), balance), "Emergency withdraw failed");
    }
}