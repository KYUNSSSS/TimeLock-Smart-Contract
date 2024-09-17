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

    struct ScheduledTransaction {
        address recipient;
        uint256 amount;
        uint256 unlockTime;
        bool active;
    }

    mapping(address => Account) public accounts;
    mapping(address => ScheduledTransaction[]) public scheduledWithdrawals;
    mapping(address => ScheduledTransaction[]) public scheduledTransfers;

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

    // Function to manually add a specified amount of funds
    function addFunds(uint256 _amount) external payable {
        require(msg.value == _amount, "Sent Ether does not match the specified amount");
        accounts[msg.sender].balance += _amount;
    }


    // Check balance
    function checkBalance(address _account) external view returns (uint256) {
        return accounts[_account].balance;
    }

    // Check time remaining for child account to reach adulthood
    function checkTimeRemaining(address _child) external view returns (uint256) {
        if (block.timestamp >= accounts[_child].contractEndTime) {
            return 0;
        }
        return accounts[_child].contractEndTime - block.timestamp;
    }

    // Withdraw funds for parent or child (if child is over 18)
    function withdraw(uint256 _amount) external sufficientBalance(msg.sender, _amount) {
        accounts[msg.sender].balance -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    // Schedule withdrawal (child over 18)
    function addScheduleWithdraw(uint256 _amount, uint256 _timePeriod) external onlyAdult(msg.sender) sufficientBalance(msg.sender, _amount) {
        scheduledWithdrawals[msg.sender].push(ScheduledTransaction({
            recipient: msg.sender,
            amount: _amount,
            unlockTime: block.timestamp + _timePeriod,
            active: true
        }));
    }

    // Cancel scheduled withdrawal
    function cancelScheduleWithdraw(uint256 _index) external onlyParent(msg.sender) {
        require(scheduledWithdrawals[msg.sender][_index].active, "No active scheduled withdrawal");
        scheduledWithdrawals[msg.sender][_index].active = false;
    }

    // Execute scheduled withdrawal
    function executeScheduledWithdraw(uint256 _index) external onlyAdult(msg.sender) {
        ScheduledTransaction storage scheduledTx = scheduledWithdrawals[msg.sender][_index];
        require(scheduledTx.active, "No active scheduled withdrawal");
        require(block.timestamp >= scheduledTx.unlockTime, "Withdrawal time has not been reached");

        accounts[msg.sender].balance -= scheduledTx.amount;
        payable(scheduledTx.recipient).transfer(scheduledTx.amount);
        scheduledTx.active = false;
    }

    // Instant transfer
    function instantTransfer(address _to, uint256 _amount) external sufficientBalance(msg.sender, _amount) {
        accounts[msg.sender].balance -= _amount;
        accounts[_to].balance += _amount;
    }

    // Schedule transfer (parent)
    function scheduleTransfer(address _to, uint256 _amount, uint256 _timePeriod) external sufficientBalance(msg.sender, _amount) {
        scheduledTransfers[msg.sender].push(ScheduledTransaction({
            recipient: _to,
            amount: _amount,
            unlockTime: block.timestamp + _timePeriod,
            active: true
        }));
    }

    // Cancel scheduled transfer
    function cancelScheduledTransfer(uint256 _index) external {
        require(scheduledTransfers[msg.sender][_index].active, "No active scheduled transfer");
        scheduledTransfers[msg.sender][_index].active = false;
    }

    // Execute scheduled transfer
    function executeScheduledTransfer(uint256 _index) external {
        ScheduledTransaction storage scheduledTx = scheduledTransfers[msg.sender][_index];
        require(scheduledTx.active, "No active scheduled transfer");
        require(block.timestamp >= scheduledTx.unlockTime, "Transfer time has not been reached");

        accounts[msg.sender].balance -= scheduledTx.amount;
        accounts[scheduledTx.recipient].balance += scheduledTx.amount;
        scheduledTx.active = false;
    }

    // Add a child account under a parent
    function addChildAccount(address _child) external {
        require(accounts[_child].parent == address(0), "Child account already exists");
        accounts[_child] = Account({
            balance: 0,
            startTime: block.timestamp,
            contractEndTime: block.timestamp + 18 * 365 days, // Set for 18 years
            parent: msg.sender,
            isChild: true
        });
    }
}
