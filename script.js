let account;
let web3;
let contract;
let contractInterest;
const ABI = [
	{
		"inputs": [],
		"name": "executeAutoScheduledTransfers",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AccountArchived",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AccountReactivated",
		"type": "event"
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
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addAmount",
				"type": "uint256"
			}
		],
		"name": "addInterestBalance",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"inputs": [],
		"name": "archiveAccount",
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
		"name": "cancelScheduledTransfer",
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
		"inputs": [],
		"name": "checkArchiveStatus",
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
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "copyUserToAccount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "deductAmount",
				"type": "uint256"
			}
		],
		"name": "deductInterestBalance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deleteAccount",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_child",
				"type": "address"
			}
		],
		"name": "grantModificationAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "instantTransfer",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "login",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newAddress",
				"type": "address"
			}
		],
		"name": "migrateAccount",
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
				"indexed": true,
				"internalType": "address",
				"name": "child",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ModificationAccessGranted",
		"type": "event"
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
				"indexed": true,
				"internalType": "address",
				"name": "child",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ModificationAccessRevoked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_email",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_age",
				"type": "uint256"
			}
		],
		"name": "modifyProfile",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "Paused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ProfileModified",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "reactivateAccount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_email",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_age",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_parent",
				"type": "address"
			},
			{
				"internalType": "enum DepositAndWithdraw.AccountType",
				"name": "_accountType",
				"type": "uint8"
			}
		],
		"name": "register",
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
			}
		],
		"name": "revokeModificationAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
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
		"name": "scheduleAutoExecution",
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
				"name": "sender",
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
		"name": "ScheduledTransferCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
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
		"name": "ScheduledTransferCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
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
		"name": "ScheduledTransferExecuted",
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TransferExecuted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "unpause",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "UserLoggedIn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "UserRegistered",
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
		"name": "children",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllScheduledTransfers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "receivers",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amounts",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "unlockTimes",
				"type": "uint256[]"
			},
			{
				"internalType": "bool[]",
				"name": "activeStatuses",
				"type": "bool[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getAllTransferHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct DepositAndWithdraw.TransferRecord[]",
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
		"name": "getArchiveTimestamp",
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
				"name": "_parent",
				"type": "address"
			}
		],
		"name": "getChildren",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
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
				"name": "_child",
				"type": "address"
			}
		],
		"name": "getParent",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "account",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "age",
						"type": "uint256"
					},
					{
						"internalType": "enum DepositAndWithdraw.AccountType",
						"name": "accountType",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "parent",
						"type": "address"
					},
					{
						"internalType": "enum DepositAndWithdraw.AccountStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "archiveTimestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct DepositAndWithdraw.User",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getProfile",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "account",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "email",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "age",
						"type": "uint256"
					},
					{
						"internalType": "enum DepositAndWithdraw.AccountType",
						"name": "accountType",
						"type": "uint8"
					},
					{
						"internalType": "address",
						"name": "parent",
						"type": "address"
					},
					{
						"internalType": "enum DepositAndWithdraw.AccountStatus",
						"name": "status",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "archiveTimestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct DepositAndWithdraw.User",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getTimeUntilDeletion",
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
				"name": "_sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			}
		],
		"name": "getTotalTransactionAmount",
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
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getTransferDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
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
				"name": "_user1",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_user2",
				"type": "address"
			}
		],
		"name": "getTransferHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "sender",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "receiver",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct DepositAndWithdraw.TransferRecord[]",
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
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserStatus",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
			}
		],
		"name": "modificationAccessGranted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paused",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
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
		"name": "scheduledTransfers",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
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
		"inputs": [],
		"name": "SECONDS_IN_A_YEAR",
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
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "transferHistory",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "email",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"internalType": "enum DepositAndWithdraw.AccountType",
				"name": "accountType",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "parent",
				"type": "address"
			},
			{
				"internalType": "enum DepositAndWithdraw.AccountStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "archiveTimestamp",
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
const ABIInterest = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_depositAndWithdrawAddress",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "constructor"
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
				"name": "newInterval",
				"type": "uint256"
			}
		],
		"name": "AccrualIntervalChanged",
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
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "interestAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "InterestAdd",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "interestAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "InterestWithdrawn",
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
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MONTHLY_INTERVAL",
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
		"name": "TESTING_INTERVAL",
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
		"name": "YEARLY_INTERVAL",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "accountBalances",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "accountInterestRates",
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
				"name": "account",
				"type": "address"
			}
		],
		"name": "addInterest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
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
		"name": "addInterestHistory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"name": "calculateInterest",
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
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "percentage",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "toAccount",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "fromAccount",
				"type": "address"
			}
		],
		"name": "distributeInterest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "interestDistributed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestWithdraw",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
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
		"name": "distributionHistory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "getAccountBalances",
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
				"name": "account",
				"type": "address"
			}
		],
		"name": "getAccountInterestRates",
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
				"name": "user",
				"type": "address"
			}
		],
		"name": "getAddInterestHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "interestAmount",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "recipient",
						"type": "address"
					}
				],
				"internalType": "struct InterestModule.InterestHistory[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
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
				"name": "user",
				"type": "address"
			}
		],
		"name": "getDistributionHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "interestAmount",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "recipient",
						"type": "address"
					}
				],
				"internalType": "struct InterestModule.InterestHistory[]",
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
				"name": "account",
				"type": "address"
			}
		],
		"name": "getLastInterestCalculationTime",
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
				"name": "contractAddress",
				"type": "address"
			}
		],
		"name": "getOtherContractBalance",
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
				"name": "account",
				"type": "address"
			}
		],
		"name": "getUserAccrualInterval",
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
				"name": "user",
				"type": "address"
			}
		],
		"name": "getWithdrawalHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "interestAmount",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "recipient",
						"type": "address"
					}
				],
				"internalType": "struct InterestModule.InterestHistory[]",
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
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startEpoch",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endEpoch",
				"type": "uint256"
			}
		],
		"name": "interestCalculator",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
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
		"name": "interfaceDepositAndWithdraw",
		"outputs": [
			{
				"internalType": "contract IDepositAndWithdraw",
				"name": "",
				"type": "address"
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
			}
		],
		"name": "lastInterestCalculationTime",
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
		"name": "monthlyInterestRate",
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
				"name": "account",
				"type": "address"
			}
		],
		"name": "setFirstDeposit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newInterval",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "setUserAccrualInterval",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "testAccount",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "testingInterestRate",
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
				"name": "account",
				"type": "address"
			}
		],
		"name": "updateLastInterestCalculationTime",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userAccrualIntervals",
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
				"name": "account",
				"type": "address"
			}
		],
		"name": "withdrawInterest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
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
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "interestAmount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "yearIn30Seconds",
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
		"name": "yearlyInterestRate",
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
		"stateMutability": "payable",
		"type": "receive"
	}
];


// Define the ABI and contract address globally
const Address = "0x2633b8b64f09CC9bEf817f1a47E55B3Abb1f485f";
const AddressInterest = "0x4ea147Bc6F6EED52aD5129bCfcFe35a5f1885FAe"; //Interest Module Addres

function showSection(sectionId) {
    const sections = document.querySelectorAll('.hidden-section');
    
    // Hide all sections
    sections.forEach(section => {
        section.style.opacity = 0;
        setTimeout(() => {
            section.style.display = 'none';
        }, 500);
    });

    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
        setTimeout(() => {
            targetSection.style.display = 'block';
            setTimeout(() => targetSection.style.opacity = 1, 10);
        }, 500);
    }

    // Update the URL hash without reloading the page
    window.history.pushState(null, null, `#${sectionId}`);
}

// Connect MetaMask Wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            document.getElementById('navAddress').value = account;
            document.getElementById('account').innerText = account;
            web3 = new Web3(window.ethereum); // Instantiate web3 with MetaMask provider
            contract = new web3.eth.Contract(ABI, Address); // Instantiate the contract
            contractInterest = new web3.eth.Contract(ABIInterest, AddressInterest);
            fetchBalance();
            document.getElementById('account2').innerText = account;
            document.getElementById('account3').innerText = account;
        } catch (error) {
            console.error("User denied account access", error);
            // alert("Error connecting wallet. Check console for details.");
        }
    } else {
        alert("Please install MetaMask!");
    }
}


async function fetchBalance() {
    try {
        const balanceWei = await contract.methods.checkMyBalance().call({ from: account }); // Adjust according to your method
        const etherBalance = web3.utils.fromWei(balanceWei, 'ether');
        
        // Update all elements with the balanceResult class
        const balanceElements = document.querySelectorAll(".balanceResult");
        balanceElements.forEach(element => {
            element.innerText = `${etherBalance}`;
        });
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}


// Update the balance when the account changes (if applicable)
ethereum.on('accountsChanged', (accounts) => {
    account = accounts[0];
    document.getElementById('navAddress').value = account;
    document.getElementById('account').innerText = account;
    fetchBalance(); // Fetch balance again with the new account
});

window.addEventListener('load', connectWallet);
// Checking the balance
async function checkBalance() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const sender = accounts[0];

        contract.methods.checkMyBalance().call({ from: sender })
            .then((balance) => {
                const etherBalance = web3.utils.fromWei(balance, 'ether');
                querySelectorAll.getElementsByClassName('balanceResult').innerText = `${etherBalance}`;
				console.log(etherBalance);
                window.location.reload();
            })
            .catch((error) => {
                querySelectorAll.getElementsByClassName('balanceResult').innerText = `Error: ${error.message}`;
            });
    } catch (error) {
        querySelectorAll.getElementsByClassName('balanceResult').innerText = 'Please connect to MetaMask.';
    }
}

// Fetch and display the current block timestamp
// const getTimestamp = document.getElementById('accountDetails');
// getTimestamp.addEventListener('click', async () => {
//     try {
//         const timestamp = await contract.methods.getCurrentBlockTimestamp().call();
//         document.getElementById('timestampResult').innerText = `${timestamp}`;
//     } catch (error) {
//         document.getElementById('timestampResult').innerText = `Please connect to MetaMask`;
//     }
// });

// Handle checking time remaining
async function loadAccountTime() {
    try {
        if (typeof ethereum !== 'undefined') {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            const sender = accounts[0];

            // Assuming accountContract is already defined and initialized
            const profile = await contract.methods.getProfile().call({ from: sender });
            const age = profile.age;

            const yearsRemaining = 18 - age;
            let timeRemaining = yearsRemaining > 0 ? yearsRemaining * 365 * 24 * 3600 : 0;

            if (timeRemaining === 0) {
                document.getElementById('timeRemainingResult').innerText = "No time remaining (already 18 or older).";
            } else {
                const days = Math.floor(timeRemaining / (3600 * 24));
                const hours = Math.floor((timeRemaining % (3600 * 24)) / 3600);
                const minutes = Math.floor((timeRemaining % 3600) / 60);
                const seconds = timeRemaining % 60;

                document.getElementById('timeRemainingResult').innerText =
                    `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds until turning 18.`;
            }
        } else {
            alert("Please install MetaMask!");
        }
    } catch (error) {
        console.error("Error occurred:", error);
        document.getElementById('timeRemainingResult').innerText = "An error occurred while fetching the data.";
    }
};

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
            // Check the balance after funds are successfully added
            checkBalance();
            window.location.reload();
        })
        .catch((error) => {
            document.getElementById('fundsResponse').innerText = `Error: ${error.message}`;
        });
		//Interest Module Code
		await contractInterest.methods.setFirstDeposit(sender).send({ from: sender });//Check is it first time deposit

});


// Function to set the amount when a button is clicked
function setWithdrawAmount(value) {
    document.getElementById('instantWithdrawAmount').value = value;
}
window.addEventListener('load', loadAccountTime);
window.addEventListener('load', connectWallet);
// Function to withdraw instantly
async function instantWithdraw() {
    const amount = document.getElementById('instantWithdrawAmount').value;

    if (amount > 0) {
        try {
            await contract.methods.withdraw(web3.utils.toWei(amount, 'ether')).send({ from: account });
            alert("Instant withdrawal successful!");
            checkBalance(); // Check balance after withdrawal
            window.location.reload();
        } catch (error) {
            console.error("Error withdrawing instantly:", error);
            alert("Error in instant withdrawal. Check console for details.");
        }
    } else {
        alert("Please enter a valid withdrawal amount.");
    }
}

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
            checkBalance();
            window.location.reload();
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

    // Interest Module -- Start
    // Refresh account information
    async function refreshAccountInfo() {
		const account = await ethereum.request({ method: "eth_requestAccounts" });
        const sender = account[0];
		const balance = await contract.methods.checkMyBalance(sender).call({ from: sender }); // Fixed accounts[0]
		document.getElementById("account-balance").innerText = web3.utils.fromWei(balance, "ether") + " ETH";
		// await contractInterest.methods.setFirstDeposit(sender).send({from: sender});//Check is it first time deposit
		accrualInterval = await contractInterest.methods.getUserAccrualInterval(sender).call({ from: sender });
		if (accrualInterval == 31536000) {
		  accrualInterval = "Yearly";
		} else if (accrualInterval == 2592000) {
		  accrualInterval = "Monthly";
		} else if (accrualInterval == 30) {
		  accrualInterval = "Testing (30 seconds)";
		}
		document.getElementById("accrual-interval").innerText = accrualInterval;
  
		const interestRate = await contractInterest.methods.getAccountInterestRates(sender).call({ from: sender });
		document.getElementById("interest-rate").innerText = interestRate + "%";
	  }
  
	  // Calculate interest
	  document.getElementById("calculate-interest").addEventListener('click', async () => {
		const calcAmount = document.getElementById("calc-amount").value;
		const amount = web3.utils.toWei(calcAmount, "ether");
		console.log(amount);
		const startTimes = document.getElementById("startTime").value;
		const endTimes = document.getElementById("endTime").value;
  
		// Convert to Date objects
		const startDate = new Date(startTimes);
		const endDate = new Date(endTimes);
  
		// Convert to epoch time in seconds
		const startEpoch = Math.floor(startDate.getTime() / 1000);
		const endEpoch = Math.floor(endDate.getTime() / 1000);
		console.log(startEpoch);
		console.log(endEpoch);
  
		try {
		  const result = await contractInterest.methods.interestCalculator(amount, startEpoch, endEpoch).call(); // Adjust start and end epochs
		  document.getElementById("interest-test").innerText = web3.utils.fromWei(result[0], "ether") + " ETH";
		  document.getElementById("interest-month").innerText = web3.utils.fromWei(result[1], "ether") + " ETH";
		  document.getElementById("interest-year").innerText = web3.utils.fromWei(result[2], "ether") + " ETH";
		} catch (error) {
		  console.error("Error calculating interest:", error);
		}
	  });
  
	  //
  
  
	  document.getElementById("add-interest").addEventListener('click', async () => {
		const accounts = await web3.eth.getAccounts();
		const sender = accounts[0];
  
		try {
		  // Call the contract to add interest
		  const receipt = await contractInterest.methods.addInterest(sender).send({ from: sender });
  
		  // Extract the interest amount from the emitted event
		  const interestEvent = receipt.events.InterestAdd;
		  const interestAmount = interestEvent.returnValues.interestAmount; // Extract the interest amount
  
		  // Display success message
		  document.getElementById("add-interest-status").innerText = "Interest added successfully!";
  
		  // Call the main contract to update the interest balance with the extracted amount
		  await contract.methods.addInterestBalance(sender, interestAmount).send({ from: sender });
  
		} catch (error) {
		  document.getElementById("add-interest-status").innerText = "Error adding interest.";
		  console.error(error);
		}
	  });
  
  
	  // Withdraw interest
	  document.getElementById("withdraw-interest").addEventListener('click', async () => {
		const accounts = await web3.eth.getAccounts();
		const sender = accounts[0];
		try {
		  interestDeduct = await contractInterest.methods.withdrawInterest(sender).send({ from: sender });
		  if (interestDeduct > 0) {
			contract.methods.deductInterestBalance(sender, interestDeduct);
		  }
		  document.getElementById("withdraw-interest-status").innerText = "Interest withdrawn successfully!";
		} catch (error) {
		  document.getElementById("withdraw-interest-status").innerText = "Error withdrawing interest.";
		  console.error(error);
		}
	  });
  
	  // Distribute interest
	  document.getElementById("distribute-interest").addEventListener('click', async () => {
		const accounts = await web3.eth.getAccounts();
		const sender = accounts[0];
		const percentage = document.getElementById("distribute-percentage").value; // Corrected ID
		const recipientAddress = document.getElementById("Recipient-Address").value;
  
		try {
		  result = await contractInterest.methods.distributeInterest(percentage, recipientAddress, sender).send({ from: sender });
		  const interestDistributed = result[0];
		  const interestWithdraw = result[1];
		  if (result[0] > 0) {
			contract.methods.deductInterestBalance(recipientAddress, interestDeduct);
		  }
		  if (result[1] > 0) {
			contract.methods.deductInterestBalance(sender, interestDeduct);
		  }
		  document.getElementById("distribute-interest-status").innerText = "Interest distributed successfully!"; // Corrected ID
		} catch (error) {
		  document.getElementById("distribute-interest-status").innerText = "Error distributing interest."; // Corrected ID
		  console.error(error);
		}
	  });
  
	  // Change accrual interval
	  document.getElementById("change-interval").addEventListener('click', async () => {
		const accounts = await web3.eth.getAccounts();
		const sender = accounts[0];
		const selectedInterval = document.getElementById("interval-select").value;
  
		try {
		  await contractInterest.methods.setUserAccrualInterval(selectedInterval, sender).send({ from: sender });
		  document.getElementById("change-interval-status").innerText = "Interval changed successfully!";
		} catch (error) {
		  document.getElementById("change-interval-status").innerText = "Error changing interval.";
		  console.error(error);
		}
	  });
  
	  // Get Interest History
	  async function getInterestHistory() {
		const accounts = await web3.eth.getAccounts();
		const sender = accounts[0];
		console.log(sender);
  
		// Clear previous history display
		document.getElementById("withdrawal-history").innerHTML = '';
		document.getElementById("distribution-history").innerHTML = '';
		document.getElementById("add-interest-history").innerHTML = '';
  
		// Helper function to create table rows
		function createRow(item) {
		  const row = document.createElement("tr");
		  const interestInEther = web3.utils.fromWei(item.interestAmount.toString(), 'ether'); // Convert Wei to Ether
  
		  row.innerHTML = `
			  <td>${new Date(item.timestamp * 1000).toLocaleString()}</td>
			  <td>${interestInEther} ETH</td>
			  <td>${item.recipient}</td>
		  `;
		  return row;
		}
  
		// Get withdrawal history
		try {
		  const withdrawalHistory = await contractInterest.methods.getWithdrawalHistory(sender).call({ from: sender });
		  withdrawalHistory.forEach(item => {
			document.getElementById("withdrawal-history").appendChild(createRow(item));
		  });
		} catch (error) {
		  console.error("Error fetching withdrawal history:", error);
		}
  
		// Get distribution history
		try {
		  const distributionHistory = await contractInterest.methods.getDistributionHistory(sender).call({ from: sender });
		  distributionHistory.forEach(item => {
			document.getElementById("distribution-history").appendChild(createRow(item));
		  });
		} catch (error) {
		  console.error("Error fetching distribution history:", error);
		}
  
		// Get Add Interest history
		try {
		  const addInterestHistory = await contractInterest.methods.getAddInterestHistory(sender).call({ from: sender });
		  addInterestHistory.forEach(item => {
			document.getElementById("add-interest-history").appendChild(createRow(item));
		  });
		} catch (error) {
		  console.error("Error fetching add interest history:", error);
		}
	  }
  
	  // Interest Module -- End 
  

// Call this function when loading the page
window.addEventListener('load', displayTimeRemaining);

