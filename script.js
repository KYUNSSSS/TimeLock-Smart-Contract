let account;
let web3;
let contract;

// Define the ABI and contract address globally
const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_child",
                "type": "address"
            }
        ],
        "name": "addChildAccount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "addFunds",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_unlockTime",
                "type": "uint256"
            }
        ],
        "name": "addScheduleWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_child",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_amountWithdraw",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_unlockTime",
                "type": "uint256"
            }
        ],
        "name": "addScheduleWithdrawForChild",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "cancelScheduleWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "parent",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "child",
                "type": "address"
            }
        ],
        "name": "ChildAccountAdded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "executeScheduledWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "FundsAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "ScheduledWithdrawCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "unlockTime",
                "type": "uint256"
            }
        ],
        "name": "ScheduledWithdrawCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "ScheduledWithdrawExecuted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "WithdrawalMade",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "accounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "contractEndTime",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "parent",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "isChild",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "checkMyBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_child",
                "type": "address"
            }
        ],
        "name": "checkTimeRemaining",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentBlockTimestamp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_account",
                "type": "address"
            }
        ],
        "name": "listScheduledWithdrawals",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "unlockTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                    }
                ],
                "internalType": "struct DepositAndWithdraw.ScheduledWithdraw[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_account",
                "type": "address"
            }
        ],
        "name": "listWithdrawals",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isScheduled",
                        "type": "bool"
                    }
                ],
                "internalType": "struct DepositAndWithdraw.Withdrawal[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "scheduledWithdrawals",
        "outputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "unlockTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "withdrawalHistory",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isScheduled",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const Address = "0xEB3f419932CcE2cC43a012bC9239E10c0C4b03d1"; // Replace with your contract address

// Function to show the correct section and hide others
// function showSection(sectionId) {
//     const sections = document.querySelectorAll('.hidden-section');
//     sections.forEach(section => section.style.display = 'none');  // Hide all sections
//     document.getElementById(sectionId).style.display = 'block';  // Show the selected section
// }

function showSection(sectionId) {
    const sections = document.querySelectorAll('.hidden-section');
    
    // Hide all sections
    sections.forEach(section => {
        section.style.opacity = 0;  // Set opacity to 0 for fade-out effect
        setTimeout(() => {
            section.style.display = 'none';  // Hide after fade-out
        }, 500);  // Keep in sync with the transition duration
    });

    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
        // Show the selected section with fade-in effect
        setTimeout(() => {
            targetSection.style.display = 'block';  // First, make it visible
            setTimeout(() => targetSection.style.opacity = 1, 10);  // Then apply fade-in effect
        }, 500);  // Delay showing until all others are hidden
    }

    // Update the URL hash without reloading the page
    window.history.pushState(null, null, `#${sectionId}`);
}

// Run when the page loads
window.onload = function() {
    // Check if there's a hash in the URL
    const currentHash = window.location.hash;
    if (currentHash) {
        // Show the section based on the hash
        showSection(currentHash.substring(1));  // Remove the '#' from the hash
    } else {
        // Show a default section if no hash is present
        showSection('addFundsSection');  // For example, the deposit section
    }
};

// Connect MetaMask Wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            document.getElementById('account').innerText = account;
            document.getElementById('account2').innerText = account;
            document.getElementById('account3').innerText = account;
            document.getElementById('account4').innerText = account;
            document.getElementById('account5').innerText = account;
            web3 = new Web3(window.ethereum); // Instantiate web3 with MetaMask provider
            contract = new web3.eth.Contract(ABI, Address); // Instantiate the contract
            document.getElementById('contractArea').innerText = "Transaction Smart Contract";
        } catch (error) {
            console.error("User denied account access", error);
            //alert("Error connecting wallet. Check console for details.");
        }
    } else {
        alert("Please install MetaMask!");
    }
}
window.addEventListener('load', connectWallet);
// Checking the balance
const checkBalance = document.getElementById('accountDetails');
checkBalance.addEventListener('click', async () => {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    contract.methods.checkMyBalance().call({ from: sender })
        .then((balance) => {
            const etherBalance = web3.utils.fromWei(balance, 'ether');
            document.getElementById('balanceResult').innerText = `${etherBalance}`;
        })
        .catch((error) => {
            document.getElementById('balanceResult').innerText = `Please coonect to MetaMask`;
        });
});

// Fetch and display the current block timestamp
const getTimestamp = document.getElementById('accountDetails');
getTimestamp.addEventListener('click', async () => {
    try {
        const timestamp = await contract.methods.getCurrentBlockTimestamp().call();
        document.getElementById('timestampResult').innerText = `${timestamp}`;
    } catch (error) {
        document.getElementById('timestampResult').innerText = `Please connect to MetaMask`;
    }
});

// Handle checking time remaining
const checkTime = document.getElementById('accountDetails');
checkTime.addEventListener('click', async () => {
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    contract.methods.checkTimeRemaining(sender).call({
        from: sender
    })
        .then((timeRemaining) => {
            if (timeRemaining == 0) {
                document.getElementById('timeRemainingResult').innerText = "No time remaining (contract ended).";
            } else {
                // Convert seconds to a human-readable format (days, hours, minutes)
                const days = Math.floor(timeRemaining / (3600 * 24));
                const hours = Math.floor((timeRemaining % (3600 * 24)) / 3600);
                const minutes = Math.floor((timeRemaining % 3600) / 60);
                const seconds = timeRemaining % 60;

                document.getElementById('timeRemainingResult').innerText =
                    `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
            }
        })
        .catch((error) => {
            document.getElementById('timeRemainingResult').innerText = `Error: ${error.message}`;
        });
});

// Function to set the amount when a button is clicked
function setAmount(value) {
    document.getElementById('amount').value = value;
}

// Add Funds to the contract
const addFundsForm = document.getElementById('addFundsForm');
addFundsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    contract.methods.addFunds().send({
        from: sender,
        value: web3.utils.toWei(amount, 'ether')
    })
        .then((receipt) => {
            document.getElementById('fundsResponse').innerText = 'Funds added successfully!';
        })
        .catch((error) => {
            document.getElementById('fundsResponse').innerText = `Error: ${error.message}`;
        });
});

// Function to set the amount when a button is clicked
function setAmount(value) {
    document.getElementById('instantWithdrawAmount').value = value;
}

window.addEventListener('load', connectWallet);
// Function to withdraw instantly
async function instantWithdraw() {
    const amount = document.getElementById('instantWithdrawAmount').value;

    if (amount > 0) {
        try {
            await contract.methods.withdraw(web3.utils.toWei(amount, 'ether')).send({ from: account });
            alert("Instant withdrawal successful!");
        } catch (error) {
            console.error("Error withdrawing instantly:", error);
            alert("Error in instant withdrawal. Check console for details.");
        }
    } else {
        alert("Please enter a valid withdrawal amount.");
    }
}

document.getElementById('getWithdrawalsButton').addEventListener('click', async function () {
    // Get the currently connected account
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    // Get the withdrawal history from the contract
    contract.methods.listWithdrawals(account).call({ from: account })
        .then((withdrawals) => {
            // Clear previous table content
            const withdrawalTableBody = document.getElementById('withdrawalHistoryTable');
            withdrawalTableBody.innerHTML = '';

            // Populate the table with withdrawal data
            withdrawals.forEach((withdrawal, index) => {
                const newRow = document.createElement('tr');

                // Convert timestamp to a human-readable format
                const timestamp = new Date(withdrawal.timestamp * 1000).toLocaleString();

                // Create table cells for amount, timestamp, and whether it was scheduled
                const amountCell = document.createElement('td');
                const timestampCell = document.createElement('td');
                const isScheduledCell = document.createElement('td');

                amountCell.innerText = web3.utils.fromWei(withdrawal.amount, 'ether') + ' ETH';
                timestampCell.innerText = timestamp;
                isScheduledCell.innerText = withdrawal.isScheduled ? 'Yes' : 'No';

                newRow.appendChild(amountCell);
                newRow.appendChild(timestampCell);
                newRow.appendChild(isScheduledCell);

                withdrawalTableBody.appendChild(newRow);
            });
        })
        .catch((error) => {
            console.error('Error fetching withdrawal history:', error);
        });
});

// List all withdrawals for the connected account and display them in a table
async function listWithdrawalHistory() {
    try {
        // Fetch the withdrawal history from the contract
        const withdrawals = await contract.methods.listWithdrawals(account).call();

        // Get the table body where the rows will be populated
        const tableBody = document.getElementById('withdrawalHistoryBody');

        // Clear previous rows
        tableBody.innerHTML = '';

        // Loop through the withdrawals and populate the table
        withdrawals.forEach((withdrawal, index) => {
            const amount = web3.utils.fromWei(withdrawal.amount, 'ether');  // Convert amount from Wei to ETH
            const timestamp = new Date(withdrawal.timestamp * 1000).toLocaleString();  // Convert UNIX timestamp to readable date

            // Create a new row for each withdrawal
            const row = document.createElement('tr');
            row.innerHTML = `
                        <td>${index}</td>
                        <td>${amount}</td>
                        <td>${timestamp}</td>
                    `;

            // Append the new row to the table body
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error listing withdrawal history:", error);
    }
}

// Call listWithdrawalHistory initially to display withdrawals when the page loads
window.onload = listWithdrawalHistory;

// Add a child account
async function addChildAccount() {
    const childAddress = document.getElementById('childAddress').value;
    if (web3.utils.isAddress(childAddress)) {
        try {
            await contract.methods.addChildAccount(childAddress).send({ from: account });
            alert("Child account added successfully!");
        } catch (error) {
            console.error("Error adding child account:", error);
            alert("Error adding child account. Check console for details.");
        }
    } else {
        alert("Please enter a valid child address.");
    }
}

// Schedule withdrawal for the child account
async function addScheduleWithdraw() {
    const amount = document.getElementById('withdrawAmount').value;
    const datetimeInput = document.getElementById('withdrawDateTime').value;
    const date = new Date(datetimeInput);
    const unlockPeriod = Math.floor(date.getTime() / 1000); // Correctly getting the unlock time in seconds

    const timestamp = await contract.methods.getCurrentBlockTimestamp().call();

    if (amount > 0 && unlockPeriod > timestamp) {
        try {
            await contract.methods.addScheduleWithdraw(
                web3.utils.toWei(amount, 'ether'),
                unlockPeriod // Use the numeric unlockPeriod here
            ).send({ from: account });
            alert("Scheduled withdrawal successfully!");
        } catch (error) {
            console.error("Error scheduling withdrawal:", error);
            alert("Error scheduling withdrawal. Check console for details.");
        }
    } else {
        alert("Please enter a valid amount and unlock period.");
    }
}

// Execute scheduled withdrawal
async function executeScheduledWithdraw() {
    const withdrawIndex = document.getElementById('withdrawIndex').value;
    if (withdrawIndex >= 0) {
        try {
            await contract.methods.executeScheduledWithdraw(withdrawIndex).send({ from: account });
            alert("Withdrawal executed successfully!");
        } catch (error) {
            console.error("Error executing withdrawal:", error);
            alert("Error executing withdrawal. Check console for details.");
        }
    } else {
        alert("Please enter a valid withdrawal index.");
    }
}

// Call the function when the child clicks a button, providing the correct index of the scheduled withdrawal


// Cancel Schedule Withdraw
const cancelWithdrawalForm = document.getElementById('cancelWithdrawalForm');
cancelWithdrawalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const withdrawalIndex = document.getElementById('withdrawalIndex').value;
    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    contract.methods.cancelScheduleWithdraw(withdrawalIndex).send({
        from: sender
    })
        .then((receipt) => {
            document.getElementById('cancelResponse').innerText = `Scheduled withdrawal at index ${withdrawalIndex} canceled successfully.`;
        })
        .catch((error) => {
            document.getElementById('cancelResponse').innerText = `Error: ${error.message}`;
        });
});

document.getElementById('withdrawForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form from submitting the default way

    const childAddress = document.getElementById('childAddress').value;
    const amount = document.getElementById('amountWithdraw').value;
    const unlockDate = document.getElementById('unlockTime').value;

    // Convert unlock date to Unix timestamp
    const unlockTimestamp = Math.floor(new Date(unlockDate).getTime() / 1000);

    // Convert amount to Wei (smallest Ether unit)
    const weiAmount = web3.utils.toWei(amount.toString(), 'ether');

    // Get the parent (the current connected account) from MetaMask
    const accounts = await web3.eth.getAccounts();
    const parentAccount = accounts[0];

    // Call the addScheduleWithdrawForChild function
    try {
        await contract.methods.addScheduleWithdrawForChild(childAddress, weiAmount, unlockTimestamp)
            .send({ from: parentAccount });

        alert(`Scheduled withdrawal of ${amount} ETH for child ${childAddress}, to be unlocked on ${unlockDate}`);
    } catch (error) {
        console.error(error);
        alert('Error scheduling withdrawal. See console for details.');
    }
});

window.addEventListener('load', connectWallet);
window.addEventListener('load', async () => {
    try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        account = accounts[0];
        // Call the contract method and handle the result
        const result = await contract.methods.copyUserToAccount(account).send({ from: account });
        console.log(result); // Handle the result (if needed)
    } catch (error) {
        console.error("Error calling contract method:", error);
    }
});



//-----------------------------------------------------------------------------------------------
// Function to calculate and display time remaining for a child account
async function displayTimeRemaining() {
    const account = await ethereum.request({ method: "eth_requestAccounts" });
    const currentAccount = account[0];

    document.getElementById('account2').textContent = currentAccount;

    try {
        // Fetch if the account is a child account and unlock time
        const isChildAccount = await contract.methods.isChild(currentAccount).call();
        const unlockTime = await contract.methods.getUnlockTime(currentAccount).call();

        const timeRemainingSection = document.getElementById('timeRemainingSection');

        if (isChildAccount) {
            const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
            const timeDiff = unlockTime - currentTime;

            if (timeDiff > 0) {
                // Calculate remaining time
                const years = Math.floor(timeDiff / (60 * 60 * 24 * 365));
                const months = Math.floor((timeDiff % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30));
                const days = Math.floor((timeDiff % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
                const hours = Math.floor((timeDiff % (60 * 60 * 24)) / (60 * 60));
                const minutes = Math.floor((timeDiff % (60 * 60)) / 60);

                // Display the time remaining
                document.getElementById('timeRemaining').textContent = 
                    `${years} Years ${months} Months ${days} Days ${hours} Hours ${minutes} Minutes`;

                timeRemainingSection.style.display = 'block'; // Show the time remaining section
            } else {
                document.getElementById('timeRemaining').textContent = 'No time remaining. Withdrawal available.';
                timeRemainingSection.style.display = 'block';
            }
        } else {
            // If it's not a child account, hide the "Time Remaining" section
            timeRemainingSection.style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching account info:", error);
        document.getElementById('timeRemaining').textContent = 'Error fetching time remaining.';
        timeRemainingSection.style.display = 'block';
    }
}

// Call this function when loading the page
window.addEventListener('load', displayTimeRemaining);
