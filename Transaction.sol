// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transaction {

    struct Account {
        uint256 balance;
        uint256 startTime;
        uint256 contractEndTime; // End time for the contract (e.g. child reaches 18 years old)
        address parent;
        bool isChild;
    }

    struct ScheduledWithdraw {
        address recipient;
        uint256 amount;
        uint256 unlockTime;
        bool active;
    }

    mapping(address => Account) public accounts;
    mapping(address => ScheduledWithdraw[]) public scheduledWithdrawals;

    // Events
    event FundsAdded(address indexed account, uint256 amount);
    event WithdrawalMade(address indexed account, uint256 amount);
    event ScheduledWithdrawCreated(address indexed account, uint256 amount, uint256 unlockTime);
    event ScheduledWithdrawCancelled(address indexed account, uint256 amount, uint256 index);
    event ScheduledWithdrawExecuted(address indexed account, uint256 amount, uint256 index);
    event ChildAccountAdded(address indexed parent, address child);

    // Modifiers
    modifier onlyParent(address _child) {
        require(accounts[_child].parent == msg.sender, "Only parent can perform this action");
        _;
    }

    modifier onlyAdult(address _child) {
        require(block.timestamp >= accounts[_child].contractEndTime, "Child must be over 18 years old");
        _;
    }

    modifier sufficientBalance(address _account, uint256 _amount) {
        require(accounts[_account].balance >= _amount, "Insufficient balance");
        _;
    }

    // Add funds to an account
    function addFunds(uint256 _amount) external payable {
        require(msg.value == _amount, "Sent Ether does not match the specified amount");
        accounts[msg.sender].balance += _amount;
    }

    // Check balance of an account
    function checkBalance(address _account) external view returns (uint256) {
        return accounts[_account].balance;
    }

    // Check remaining time for child account to reach adulthood
    function checkTimeRemaining(address _child) external view returns (uint256) {
        if (block.timestamp >= accounts[_child].contractEndTime) {
            return 0;
        }
        return accounts[_child].contractEndTime - block.timestamp;
    }

    // Withdraw funds (added reentrancy protection)
    function withdraw(uint256 _amount) external sufficientBalance(msg.sender, _amount) {
        // Effects first
        accounts[msg.sender].balance -= _amount;

        // Interactions last
        payable(msg.sender).transfer(_amount);

        emit WithdrawalMade(msg.sender, _amount);
    }

    // Schedule withdrawal (only for child over 18)
    function addScheduleWithdraw(uint256 _amount, uint256 _timePeriod) 
        external 
        onlyAdult(msg.sender) 
        sufficientBalance(msg.sender, _amount) 
    {
        scheduledWithdrawals[msg.sender].push(ScheduledWithdraw({
            recipient: msg.sender,
            amount: _amount,
            unlockTime: block.timestamp + _timePeriod,
            active: true
        }));

        emit ScheduledWithdrawCreated(msg.sender, _amount, block.timestamp + _timePeriod);
    }

    // Cancel scheduled withdrawal
    function cancelScheduleWithdraw(uint256 _index) external {
        require(_index < scheduledWithdrawals[msg.sender].length, "Invalid withdrawal index");
        ScheduledWithdraw storage scheduledTx = scheduledWithdrawals[msg.sender][_index];
        require(scheduledTx.active, "No active scheduled withdrawal");
        
        // Refund the amount back to the user's balance
        accounts[msg.sender].balance += scheduledTx.amount;
        scheduledTx.active = false;

        emit ScheduledWithdrawCancelled(msg.sender, scheduledTx.amount, _index);
    }

    // Execute scheduled withdrawal with reentrancy protection
    function executeScheduledWithdraw(uint256 _index) 
        external 
        onlyAdult(msg.sender) 
    {
        require(_index < scheduledWithdrawals[msg.sender].length, "Invalid withdrawal index");
        ScheduledWithdraw storage scheduledTx = scheduledWithdrawals[msg.sender][_index];
        require(scheduledTx.active, "No active scheduled withdrawal");
        require(block.timestamp >= scheduledTx.unlockTime, "Unlock time has not been reached");

        // Effects first
        accounts[msg.sender].balance -= scheduledTx.amount;
        scheduledTx.active = false;

        // Interactions last
        payable(scheduledTx.recipient).transfer(scheduledTx.amount);

        emit ScheduledWithdrawExecuted(msg.sender, scheduledTx.amount, _index);
    }

    // Function to list all scheduled withdrawals for the caller
    function listScheduledWithdrawals(address _account) external view returns (ScheduledWithdraw[] memory) {
        return scheduledWithdrawals[_account];
    }


    // Add a child account under a parent
    function addChildAccount(address _child) external {
        require(accounts[_child].parent == address(0), "Child account already exists");
        require(_child != msg.sender, "Parent cannot add themselves as a child");

        accounts[_child] = Account({
            balance: 0,
            startTime: block.timestamp,
            contractEndTime: block.timestamp + 18 * 365 days, // Set contract end time for 18 years
            parent: msg.sender,
            isChild: true
        });

        emit ChildAccountAdded(msg.sender, _child);
    }
}
