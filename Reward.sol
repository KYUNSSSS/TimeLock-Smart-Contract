
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Transaction.sol";
import "./InterestModule.sol";

contract Reward {
    struct AccountRewards {
        uint256 totalRewardPoints;
        uint256 lastLogin;
        uint256 lastWeeklyTransaction;
        uint256 lastWeeklyDepositReward;
    }

    mapping(address => AccountRewards) public rewards;
    mapping(address => address[]) public parentChildAccounts;

    uint256 public constant DAILY_REWARD_POINTS = 1;
    uint256 public constant WEEKLY_TRANSACTION_REWARD = 5;
    uint256 public constant DEPOSIT_WITHDRAW_REWARD = 3;
    uint256 public constant ETHER_REWARD_THRESHOLD = 1 ether;
    uint256 public constant MAX_DEPOSIT_REWARD = 10;
    uint256 public constant ONE_WEEK = 7 * 24 * 60 * 60;
    uint256 public constant ONE_DAY = 24 * 60 * 60;

    event DailyLoginReward(address indexed user, uint256 rewardPoints);
    event WeeklyTransactionReward(address indexed user, uint256 rewardPoints);
    event CashbackReward(address indexed user, uint256 rewardPoints);
    event PrizeClaimed(address indexed user, string prize);

    Transaction public transactionContract;
    InterestModule public interestModule;

    modifier onlyLoggedInOncePerDay() {
        require(
            block.timestamp >= rewards[msg.sender].lastLogin + ONE_DAY,
            "You have already claimed your daily reward."
        );
        _;
    }

    modifier onlyOncePerWeek() {
        require(
            block.timestamp >= rewards[msg.sender].lastWeeklyTransaction + ONE_WEEK,
            "You have already claimed your weekly reward."
        );
        _;
    }

    constructor(address _transactionAddress, address payable _interestModuleAddress) {
        transactionContract = Transaction(_transactionAddress);
        interestModule = InterestModule(_interestModuleAddress);
    }

    // Daily Login Function
    function dailyLogin() external onlyLoggedInOncePerDay {
        rewards[msg.sender].totalRewardPoints += DAILY_REWARD_POINTS;
        rewards[msg.sender].lastLogin = block.timestamp;

        emit DailyLoginReward(msg.sender, DAILY_REWARD_POINTS);
    }

    // Weekly Transaction Reward - can be triggered by user
    function weeklyTransactionReward() external onlyOncePerWeek {
        rewards[msg.sender].totalRewardPoints += WEEKLY_TRANSACTION_REWARD;
        rewards[msg.sender].lastWeeklyTransaction = block.timestamp;

        emit WeeklyTransactionReward(msg.sender, WEEKLY_TRANSACTION_REWARD);
    }

    // Cashback Reward on Deposit or Withdraw
    function cashbackRewardOnTransaction(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");

        // Give 3 points for the transaction + 1 point for each Ether, up to 10 points
        uint256 rewardPoints = DEPOSIT_WITHDRAW_REWARD + ((_amount / ETHER_REWARD_THRESHOLD) * 1);
        if (rewardPoints > MAX_DEPOSIT_REWARD) {
            rewardPoints = MAX_DEPOSIT_REWARD;
        }

        // Check if the user is eligible for deposit cashback once per week
        if (block.timestamp >= rewards[msg.sender].lastWeeklyDepositReward + ONE_WEEK) {
            rewards[msg.sender].totalRewardPoints += rewardPoints;
            rewards[msg.sender].lastWeeklyDepositReward = block.timestamp;

            emit CashbackReward(msg.sender, rewardPoints);
        } else {
            revert("Deposit reward is available once per week.");
        }
    }

    // Parent Account Check for Child Reward Points
    function checkChildRewardPoints(address childAccount) external view returns (uint256) {
        require(isParent(msg.sender, childAccount), "Not a valid parent-child relationship");
        return rewards[childAccount].totalRewardPoints;
    }

    // Add a Child Account to Parent
    function addChildAccount(address childAccount) external {
        parentChildAccounts[msg.sender].push(childAccount);
    }

    // Internal Function to Check if an Account is a Child of a Parent
    function isParent(address parent, address child) internal view returns (bool) {
        for (uint256 i = 0; i < parentChildAccounts[parent].length; i++) {
            if (parentChildAccounts[parent][i] == child) {
                return true;
            }
        }
        return false;
    }

    // Claim Prizes using Reward Points
    function claimPrize(uint256 prizeId) external {
        string memory prize;
        if (prizeId == 1 && rewards[msg.sender].totalRewardPoints >= 10) {
            prize = "Prize: $10 Gift Card";
            rewards[msg.sender].totalRewardPoints -= 10;
        } else if (prizeId == 2 && rewards[msg.sender].totalRewardPoints >= 20) {
            prize = "Prize: $25 Gift Card";
            rewards[msg.sender].totalRewardPoints -= 20;
        } else if (prizeId == 3 && rewards[msg.sender].totalRewardPoints >= 50) {
            prize = "Prize: Bluetooth Speaker";
            rewards[msg.sender].totalRewardPoints -= 50;
        } else {
            revert("Not enough reward points or invalid prize.");
        }

        emit PrizeClaimed(msg.sender, prize);
    }

    // Get Total Reward Points of User
    function getTotalRewardPoints() external view returns (uint256) {
        return rewards[msg.sender].totalRewardPoints;
    }
}
