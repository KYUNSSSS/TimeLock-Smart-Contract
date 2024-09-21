// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DepositAndWithdraw {

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

    struct TransferRecord {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
    }

    struct ScheduledTransfer {
        address sender;
        address receiver;
        uint256 amount;
        uint256 unlockTime;
        bool active;
    }

    mapping(address => Account) public accounts;
    mapping(address => ScheduledWithdraw[]) public scheduledWithdrawals;
    mapping(address => TransferRecord[]) public transferHistory;
    mapping(address => ScheduledTransfer[]) public scheduledTransfers;

    // Events
    event FundsAdded(address indexed account, uint256 amount);
    event WithdrawalMade(address indexed account, uint256 amount);
    event ScheduledWithdrawCreated(address indexed account, uint256 amount, uint256 unlockTime);
    event ScheduledWithdrawCancelled(address indexed account, uint256 amount, uint256 index);
    event ScheduledWithdrawExecuted(address indexed account, uint256 amount, uint256 index);
    event ChildAccountAdded(address indexed parent, address child);

    //hasnhen
    event TransferExecuted(address indexed sender, address indexed receiver, uint256 amount);
    event ScheduledTransferCreated(address indexed sender, address indexed receiver, uint256 amount, uint256 unlockTime);
    event ScheduledTransferCancelled(address indexed sender, uint256 amount, uint256 index);
    event ScheduledTransferExecuted(address indexed sender, address indexed receiver, uint256 amount, uint256 index);
    event Paused();
    event Unpaused();

    address public owner;
    bool public paused;

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

    modifier greaterZero(){
        require(msg.value > 0, "Must be > 0");
        _;
    }

    function getCurrentBlockTimestamp() public view returns (uint256){
        return block.timestamp;
    }

    //hanshen code
        modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor() {
        owner = msg.sender;
        paused = false;
    }

    // Add funds to an account
    function addFunds() external greaterZero payable {
        accounts[msg.sender].balance += msg.value;
    }

    // Check balance of the calling account (msg.sender)
    function checkMyBalance() external view returns (uint256) {
        return accounts[msg.sender].balance;
    }

    // Check remaining time for child account to reach adulthood
    function checkTimeRemaining(address _child) external view returns (uint256) {
        if (block.timestamp >= accounts[_child].contractEndTime) {
            return 0;
        }
        return accounts[_child].contractEndTime - block.timestamp;
    }

    // Withdraw funds (added reentrancy protection)
    function withdraw(uint256 _amount) external sufficientBalance(msg.sender, _amount) onlyAdult(msg.sender) {
        // Effects first
        accounts[msg.sender].balance -= _amount;

        // Interactions last
        payable(msg.sender).transfer(_amount);

        emit WithdrawalMade(msg.sender, _amount);
    }

    // Schedule withdrawal (only for child over 18)
    function addScheduleWithdraw(uint256 _amount, uint256 _unlockTime) 
        external 
        onlyAdult(msg.sender) 
        sufficientBalance(msg.sender, _amount) 
    {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");

        // Deduct the amount from the account balance at the time of scheduling
        accounts[msg.sender].balance -= _amount;

        scheduledWithdrawals[msg.sender].push(ScheduledWithdraw({
            recipient: msg.sender,
            amount: _amount,
            unlockTime: _unlockTime,
            active: true
        }));

        emit ScheduledWithdrawCreated(msg.sender, _amount, _unlockTime);
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
    function executeScheduledWithdraw(uint256 _index) external 
    {
        require(_index < scheduledWithdrawals[msg.sender].length, "Invalid withdrawal index");
        ScheduledWithdraw storage scheduledTx = scheduledWithdrawals[msg.sender][_index];
        require(scheduledTx.active, "No active scheduled withdrawal");
        require(block.timestamp >= scheduledTx.unlockTime, "Unlock time has not been reached");

        // Mark the scheduled withdrawal as inactive
        scheduledTx.active = false;

        // Transfer the funds (no need to deduct the balance again)
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
            contractEndTime: block.timestamp + 18 * 365 days, // need to change to follow yunshen code
            parent: msg.sender,
            isChild: true
        });

        emit ChildAccountAdded(msg.sender, _child);
    }

    // Schedule withdrawal for a child (only the parent can do this)
    function addScheduleWithdrawForChild(address _child, uint256 _amountWithdraw, uint256 _unlockTime) 
        external 
        onlyParent(_child)
        sufficientBalance(_child, _amountWithdraw)
    {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");

        // Deduct the amount from the child's balance at the time of scheduling
        accounts[_child].balance -= _amountWithdraw;

        scheduledWithdrawals[_child].push(ScheduledWithdraw({
            recipient: _child,
            amount: _amountWithdraw,
            unlockTime: _unlockTime,
            active: true
        }));

        emit ScheduledWithdrawCreated(_child, _amountWithdraw, _unlockTime);
    }

    //hanshen
    function instantTransfer(address _to, uint256 _amount) external whenNotPaused sufficientBalance(msg.sender, _amount) onlyAdult(msg.sender){
        require(_to != address(0), "Invalid receiver address");
        require(_to != msg.sender, "Cannot transfer to yourself");

        accounts[msg.sender].balance -= _amount;
        accounts[_to].balance += _amount;

        TransferRecord memory newRecord = TransferRecord({
            sender: msg.sender,
            receiver: _to,
            amount: _amount,
            timestamp: block.timestamp
        });
        
        transferHistory[msg.sender].push(newRecord);
        transferHistory[_to].push(newRecord);

        emit TransferExecuted(msg.sender, _to, _amount);
    }

    function scheduleAutoExecution(address _to, uint256 _amount, uint256 _unlockTime) external sufficientBalance(msg.sender, _amount) onlyAdult(msg.sender){
        require(_to != address(0), "Invalid receiver address");
        require(_to != msg.sender, "Cannot schedule transfer to yourself");
        require(_amount > 0, "Amount must be greater than 0");
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");

        // Deduct the amount from the sender's balance immediately
        accounts[msg.sender].balance -= _amount;

        scheduledTransfers[msg.sender].push(ScheduledTransfer({
            sender: msg.sender,
            receiver: _to,
            amount: _amount,
            unlockTime: _unlockTime,
            active: true
        }));

        emit ScheduledTransferCreated(msg.sender, _to, _amount, _unlockTime);
    }

    function executeAutoScheduledTransfers() external {
        uint256 transferCount = scheduledTransfers[msg.sender].length;
        for (uint256 i = 0; i < transferCount; i++) {
            ScheduledTransfer storage transfer = scheduledTransfers[msg.sender][i];
            if (transfer.active && block.timestamp >= transfer.unlockTime) {
                transfer.active = false;
                accounts[transfer.receiver].balance += transfer.amount;

                transferHistory[transfer.sender].push(TransferRecord({
                    sender: transfer.sender,
                    receiver: transfer.receiver,
                    amount: transfer.amount,
                    timestamp: block.timestamp
                }));
                transferHistory[transfer.receiver].push(TransferRecord({
                    sender: transfer.sender,
                    receiver: transfer.receiver,
                    amount: transfer.amount,
                    timestamp: block.timestamp
                }));

                emit ScheduledTransferExecuted(transfer.sender, transfer.receiver, transfer.amount, i);
                emit TransferExecuted(transfer.sender, transfer.receiver, transfer.amount);
            }
        }
    }

    function cancelScheduledTransfer(uint256 _index) external {
        require(_index < scheduledTransfers[msg.sender].length, "Invalid transfer index");
        ScheduledTransfer storage transfer = scheduledTransfers[msg.sender][_index];
        require(transfer.active, "Transfer is not active");
        require(transfer.unlockTime > block.timestamp, "Transfer is already due");

        transfer.active = false;
        accounts[msg.sender].balance += transfer.amount;

        emit ScheduledTransferCancelled(msg.sender, transfer.amount, _index);
    }

    function getAllScheduledTransfers() external view returns (
        address[] memory receivers,
        uint256[] memory amounts,
        uint256[] memory unlockTimes,
        bool[] memory activeStatuses
    ) {
        uint256 transferCount = scheduledTransfers[msg.sender].length;

        // Initialize arrays to store scheduled transfer details
        receivers = new address[](transferCount);
        amounts = new uint256[](transferCount);
        unlockTimes = new uint256[](transferCount);
        activeStatuses = new bool[](transferCount);

        // Loop through the caller's scheduled transfers and store the details
        for (uint256 i = 0; i < transferCount; i++) {
            ScheduledTransfer storage transfer = scheduledTransfers[msg.sender][i];
            receivers[i] = transfer.receiver;
            amounts[i] = transfer.amount;
            unlockTimes[i] = transfer.unlockTime;
            activeStatuses[i] = transfer.active;
        }
        
        return (receivers, amounts, unlockTimes, activeStatuses);
    }


    function getTransferHistory(address _user1, address _user2) external view returns (TransferRecord[] memory) {
        require(_user1 != address(0) && _user2 != address(0), "Invalid addresses");
        require(_user1 != _user2, "Addresses must be different");

        uint256 count = 0;
        for (uint256 i = 0; i < transferHistory[_user1].length; i++) {
            if (transferHistory[_user1][i].sender == _user2 || transferHistory[_user1][i].receiver == _user2) {
                count++;
            }
        }

        TransferRecord[] memory result = new TransferRecord[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < transferHistory[_user1].length; i++) {
            if (transferHistory[_user1][i].sender == _user2 || transferHistory[_user1][i].receiver == _user2) {
                result[index] = transferHistory[_user1][i];
                index++;
            }
        }

        return result;
    }

    function getAllTransferHistory(address _user) external view returns (TransferRecord[] memory) {

        return transferHistory[_user];
    }

    function getTransferDetails(address _user, uint256 _index) external view returns (address sender, address receiver, uint256 amount, uint256 timestamp) {
        require(_index < transferHistory[_user].length, "Invalid index or no transfer history");
        TransferRecord storage record = transferHistory[_user][_index];
        return (record.sender, record.receiver, record.amount, record.timestamp);
    }

    function getTotalTransactionAmount(address _sender, address _receiver) external view returns (uint256) {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < transferHistory[_sender].length; i++) {
            if (transferHistory[_sender][i].receiver == _receiver) {
                totalAmount += transferHistory[_sender][i].amount;
            }
        }
        return totalAmount;
    }

        function pause() external onlyOwner {
        paused = true;
        emit Paused();
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused();
    }

}
