// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InterestModule {
    //InterestModule Yew Wen Kang
    //Variable Declaration
    uint256 public monthlyInterestRate = 2; // 2% for monthly
    uint256 public yearlyInterestRate = 3; // 3% for yearly
    uint256 public testingInterestRate = 1; // 1% for testing

    uint256 public constant MONTHLY_INTERVAL = 30 * 24 * 60 * 60; // 30 days in seconds 2,592,000 2592000
    uint256 public constant YEARLY_INTERVAL = 365 * 24 * 60 * 60; // 365 days in seconds 31,536,000 31536000
    uint256 public constant TESTING_INTERVAL = 30; // Set the interval to 30 seconds for testing
    uint256 public constant yearIn30Seconds = YEARLY_INTERVAL / TESTING_INTERVAL;

    struct InterestHistory {
        uint256 timestamp;   // When the interest action happened
        uint256 interestAmount; // The amount of interest withdrawn or distributed or add
        address recipient;   // The account that received the interest (for distribution)
    }

    mapping(address => uint256) public accountBalances; // User balances
    mapping(address => uint256) public accountInterestRates; // Interest rates per account
    mapping(address => uint256) public lastInterestCalculationTime; // Last interest calculation time per account
    mapping(address => uint256) public userAccrualIntervals; // Accrual interval per account
    mapping(address => InterestHistory[]) public withdrawalHistory; // Mapping for interest withdrawal history per user
    mapping(address => InterestHistory[]) public distributionHistory; // Mapping for interest distribution history per user
    mapping(address => InterestHistory[]) public addInterestHistory; // Mapping for add interest history per user

    event InterestAdd(uint256 interestAmount, address account);
    event InterestWithdrawn(uint256 interestAmount, address to);
    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event AccrualIntervalChanged(address indexed account, uint256 newInterval);

    //Modifier
    //Ensure the interest time is reach
    modifier onlyReachInterval() {
        require(block.timestamp >= lastInterestCalculationTime[msg.sender] + userAccrualIntervals[msg.sender], "Accrual interval has not been reached yet");
        _;
    }

    //Ensure user balance in contract is enough
    modifier sufficientBalance(uint256 amount) {
        require(accountBalances[msg.sender] >= amount, "Insufficient balance");
        _;
    }

    //Ensure amount is positive
    modifier positiveAmount(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero");
        _;
    }

    //Ensure the interval is valid
    modifier validInterval(uint256 newInterval){
        require(newInterval == MONTHLY_INTERVAL || newInterval == YEARLY_INTERVAL || newInterval == TESTING_INTERVAL,"Invalid interval. Must be either monthly or yearly or Testing.");
        _;
    }

    constructor() payable {
    }


    // Calculator for interest, input amount, time, rate, show the interest for testing, month , year
    // timeElapsedInSeconds is how long you want to put your balance
    function interestCalculator(uint256 amount, uint256 startEpoch, uint256 endEpoch, uint256 interestRate) public view returns (uint256 ,uint256 ,uint256) {
        require(amount > 0, "Amount must be greater than zero");
        require(interestRate > 0, "Interest rate must be greater than zero");


        //For testing
        uint256 testingIntervalPassed = (endEpoch - startEpoch) / TESTING_INTERVAL; //Pass how many 30 seconds


        //For month
        uint256 monthIntervalPassed = (endEpoch - startEpoch) / MONTHLY_INTERVAL;

        //For year
        uint256 yearIntervalPassed = (endEpoch - startEpoch) / YEARLY_INTERVAL;

        //Calculate Interest for testing 
        uint256 interestTest = (amount * testingInterestRate / 100 * testingIntervalPassed) / yearIn30Seconds; //pass 1 get 9,512,937,595 if 1 ether
        uint256 interestMonth = (amount * monthlyInterestRate / 100 * monthIntervalPassed) / 12; //1 year = 12 months
        uint256 interestYear = (amount * yearlyInterestRate / 100 * yearIntervalPassed); //in year no need
         
        return (interestTest,interestMonth,interestYear);
    }


    //-----------------------------
    // Deposit ether into the contract  (Remove after combine, check before remove)
    function deposit() public positiveAmount(msg.value) payable {
        accountBalances[msg.sender] += msg.value;

        // If first deposit, set the last interest calculation time and default interval
        if (lastInterestCalculationTime[msg.sender] == 0) {
            lastInterestCalculationTime[msg.sender] = block.timestamp;
            userAccrualIntervals[msg.sender] = TESTING_INTERVAL; // Default should be monthly but testing for test
            accountInterestRates[msg.sender] = testingInterestRate;
        }

        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw ether from the contract (remove after combine)
    function withdraw(uint256 amount) public positiveAmount(amount) sufficientBalance(amount) {
        accountBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    // Calculate interest for a specific account with a time lock
    function calculateInterest(address account) public view onlyReachInterval returns (uint256){
        uint256 interest;
        uint256 balance = accountBalances[account];
        uint256 timeElapsed = block.timestamp - lastInterestCalculationTime[account]; //Second Passed correct

        //For testing
        uint256 testingIntervalPassed = timeElapsed / TESTING_INTERVAL; //Pass how many 30 seconds

        //For month
        uint256 monthIntervalPassed = timeElapsed / MONTHLY_INTERVAL;

        //For year
        uint256 yearIntervalPassed = timeElapsed / YEARLY_INTERVAL;

        //Calculate Interest for testing 
        if(userAccrualIntervals[msg.sender] == TESTING_INTERVAL){
            interest = (balance * accountInterestRates[msg.sender] / 100 * testingIntervalPassed) / yearIn30Seconds; //pass 1 get 9,512,937,595 if 1 ether
        }else if(userAccrualIntervals[msg.sender] == MONTHLY_INTERVAL){
            interest = (balance * accountInterestRates[msg.sender] / 100 * monthIntervalPassed) / 12; //1 year = 12 months
        }else if(userAccrualIntervals[msg.sender] == YEARLY_INTERVAL){
            interest = (balance * accountInterestRates[msg.sender] / 100 * yearIntervalPassed); //in year no need
        }

        return interest;
    }

    // Add interest to the balance
    function addInterest() public onlyReachInterval {
        uint256 interest = calculateInterest(msg.sender);
        require(interest > 0, "No interest to add");

        accountBalances[msg.sender] += interest;
        lastInterestCalculationTime[msg.sender] = block.timestamp; // Update the last calculation time for the specific account
        
        // Save addInterest history
        addInterestHistory[msg.sender].push(
            InterestHistory({
                timestamp: block.timestamp,
                interestAmount: interest,
                recipient: msg.sender
            })
        );

        emit InterestAdd(interest, msg.sender);
    }

    // Allow users to change their accrual interval (monthly or yearly or testing) 
    function setUserAccrualInterval(uint256 newInterval) public validInterval(newInterval) {
        userAccrualIntervals[msg.sender] = newInterval;//change rate also
        if(newInterval == MONTHLY_INTERVAL){
            accountInterestRates[msg.sender] = monthlyInterestRate;
        }else if(newInterval == YEARLY_INTERVAL){
            accountInterestRates[msg.sender] = yearlyInterestRate;
        }else if(newInterval == TESTING_INTERVAL){
            accountInterestRates[msg.sender] = testingInterestRate;
        }
        
        emit AccrualIntervalChanged(msg.sender, newInterval);
    }

    // Withdraw accrued interest and reset interest calculation
    function withdrawInterest() public onlyReachInterval {
        uint256 interest = calculateInterest(msg.sender);
        require(interest > 0, "No interest available to withdraw");

        // Add to withdrawal history
        withdrawalHistory[msg.sender].push(
            InterestHistory({
                timestamp: block.timestamp,
                interestAmount: interest,
                recipient: msg.sender
            })
        );

        payable(msg.sender).transfer(interest);
        emit InterestWithdrawn(interest, msg.sender);
    }

    // Distribute a percentage of interest to a specific account in a single transaction
    function distributeInterest(uint256 percentage, address account) public onlyReachInterval {
        require(percentage > 0 && percentage <= 100, "Invalid percentage value"); // Ensure percentage is between 0 and 100
        require(account != address(0), "Invalid address"); // Ensure a valid account address

        uint interest = calculateInterest(msg.sender);

        uint256 interestDistributed = (interest * percentage) / 100; // Calculate interest to distribute
        uint256 interestWithdraw = interest - interestDistributed; //Remain interest withdraw

        accountBalances[msg.sender] -= interest; //Deduct the balance

        payable(account).transfer(interestDistributed); // Transfer the calculated interest to the account
        emit InterestWithdrawn(interestDistributed, account); // Emit the event for interest distribution

        payable(msg.sender).transfer(interestWithdraw); // Withdraw the remain interest
        emit InterestWithdrawn(interestWithdraw, msg.sender); // Emit the event for interest withdraw

        // Add to distribution history for both sender and recipient
        distributionHistory[msg.sender].push(
            InterestHistory({
                timestamp: block.timestamp,
                interestAmount: interestDistributed,
                recipient: account
            })
        );

        withdrawalHistory[msg.sender].push(
            InterestHistory({
                timestamp: block.timestamp,
                interestAmount: interestWithdraw,
                recipient: msg.sender
            })
        );
    }

    // Fallback function to accept Ether into the contract
    receive() external payable {}

    // Helper function to check contract balance (for testing) (Remove after combine)
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to show the current block timestamp
    function getCurrentBlockTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    // Get withdrawal history for a user
    function getWithdrawalHistory(address user) public view returns (InterestHistory[] memory) {
        return withdrawalHistory[user];
    }

    // Get distribution history for a user
    function getDistributionHistory(address user) public view returns (InterestHistory[] memory) {
        return distributionHistory[user];
    }

    // Get add interest history for a user
    function getAddInterestHistory(address user) public view returns (InterestHistory[] memory) {
        return addInterestHistory[user];
    }

    // Function to get the balance of another contract
    function getOtherContractBalance(address contractAddress) public view returns (uint256) {
        return contractAddress.balance;
    }


}
