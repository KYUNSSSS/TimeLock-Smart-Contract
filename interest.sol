// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InterestModule {
    uint256 public interestRate; // Default annual interest rate in percentage
    uint256 public lastInterestCalculationTime;
    address public admin;
    uint256 public interestRateCap = 100;
    uint256 public interestRateFloor = 0;
    uint256 public accrualInterval; // Interval in seconds for interest accrual

    mapping(address => uint256) public accountBalances; // User balances
    mapping(address => uint256) public accountInterestRates; // Interest rates per account
    mapping(address => uint256) public accountInterestAccrued; // Accrued interest per account

    event InterestAccrued(uint256 interestAmount, address account);
    event InterestRateChanged(uint256 oldRate, uint256 newRate);
    event InterestRateTierChanged(address account, uint256 newRate);
    event InterestWithdrawn(uint256 interestAmount, address to);
    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(uint256 _interestRate, uint256 _accrualInterval) payable {
        interestRate = _interestRate;
        lastInterestCalculationTime = block.timestamp;
        admin = msg.sender; // Set the contract deployer as the admin
        accrualInterval = _accrualInterval; // Set default accrual interval
    }

    // Deposit ether into the contract
    function deposit() public payable {
        require(msg.value > 0, "Must deposit a positive amount");
        accountBalances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw ether from the contract
    function withdraw(uint256 amount) public {
        require(accountBalances[msg.sender] >= amount, "Insufficient balance");
        accountBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    // Calculate interest for a specific account
    function calculateInterest(address account) public view returns (uint256) {
        uint256 balance = accountBalances[account];
        uint256 timeElapsed = block.timestamp - lastInterestCalculationTime;
        uint256 rate = accountInterestRates[account] > 0 ? accountInterestRates[account] : interestRate;

        // Calculate interest based on elapsed time in seconds
        uint256 interest = (balance * rate * timeElapsed);
        //uint256 interest = (balance * rate * timeElapsed) / (365 days * 100); // Interest for the elapsed period
        return interest;
    }

    // Accrue interest for an account and update the balance
    function accrueInterest() public {
        uint256 interest = calculateInterest(msg.sender);
        require(interest > 0, "No interest to accrue");

        accountBalances[msg.sender] += interest;
        accountInterestAccrued[msg.sender] += interest;
        lastInterestCalculationTime = block.timestamp; // Update the last calculation time
        emit InterestAccrued(interest, msg.sender);
    }

    // Admin function to change the interest rate
    function changeInterestRate(uint256 newRate) public onlyAdmin {
        require(newRate <= interestRateCap && newRate >= interestRateFloor, "Rate out of bounds");
        uint256 oldRate = interestRate;
        interestRate = newRate;
        emit InterestRateChanged(oldRate, newRate);
    }

    // Admin function to set a specific interest rate for a particular account
    function setInterestRateTier(address account, uint256 newRate) public onlyAdmin {
        accountInterestRates[account] = newRate;
        emit InterestRateTierChanged(account, newRate);
    }

    // Set the interval at which interest is accrued
    function setAccrualInterval(uint256 newInterval) public onlyAdmin {
        accrualInterval = newInterval;
    }

    // Withdraw accrued interest and reset interest calculation
    function withdrawInterest() public {
        uint256 interest = accountInterestAccrued[msg.sender];
        require(interest > 0, "No interest available to withdraw");
        require(address(this).balance >= interest, "Not enough balance in contract");

        accountInterestAccrued[msg.sender] = 0; // Reset accrued interest for the account
        payable(msg.sender).transfer(interest);
        emit InterestWithdrawn(interest, msg.sender);
    }

    // Distribute interest to multiple accounts in a single transaction
    function distributeInterest(address[] calldata accounts, uint256[] calldata amounts) public onlyAdmin {
        require(accounts.length == amounts.length, "Mismatched arrays");

        for (uint256 i = 0; i < accounts.length; i++) {
            uint256 amount = amounts[i];
            require(address(this).balance >= amount, "Insufficient contract balance");
            payable(accounts[i]).transfer(amount);
            emit InterestWithdrawn(amount, accounts[i]);
        }
    }

    // Admin can set an upper limit for the interest rate
    function setInterestRateCap(uint256 capRate) public onlyAdmin {
        interestRateCap = capRate;
    }

    // Admin can set a lower limit for the interest rate
    function setInterestRateFloor(uint256 floorRate) public onlyAdmin {
        interestRateFloor = floorRate;
    }

    // Calculate compound interest for a given number of periods
    function calculateCompoundInterest(uint256 balance, uint256 periods) public view returns (uint256) {
        uint256 compoundBalance = balance;
        for (uint256 i = 0; i < periods; i++) {
            uint256 interest = (compoundBalance * interestRate) / 100;
            compoundBalance += interest;
        }
        return compoundBalance;
    }

    // Fallback function to accept Ether into the contract
    receive() external payable {}

    // Helper function to check contract balance (for testing)
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
