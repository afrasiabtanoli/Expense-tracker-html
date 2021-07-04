const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
let contract;
let accounts;
let txData = [];
let txArray = [];

//web3 functionality
const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "amount",
				"type": "int256"
			}
		],
		"name": "transactionData",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_text",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "_amount",
				"type": "int256"
			}
		],
		"name": "addTransaction",
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
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "deleteTransaction",
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
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getExpense",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getIncome",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getIndexArray",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getTransaction",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "text",
						"type": "string"
					},
					{
						"internalType": "int256",
						"name": "amount",
						"type": "int256"
					}
				],
				"internalType": "struct ExpenseTracker.Transaction",
				"name": "txData",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const address = "0xA6Cf72617Ec1F914894eBEbe8246e52d53E5E25c";

// connect wallet


$(document).ready (async function getAccount() {
	try {
		console.log ('Web3 = ', Web3);
		console.log ('Web3.givenProvider = ', Web3.givenProvider.chainId);
		if (Web3.givenProvider) {
		  const web3 = new Web3 (Web3.givenProvider);
		  await Web3.givenProvider.enable ();
		  contract = new web3.eth.Contract(ABI, address);
		  accounts = await web3.eth.getAccounts();
		}
	  } catch (error) {
		console.log ('Error in loading Web3 = ', error);
		if (error.code === 4001) {
		}
	  }

	  const listBtn = document.querySelector('.lisst');
	  listBtn.addEventListener('click', () => {
		init();
		console.log("address: ", accounts);
		console.log("arR: ", txArray);
		txArray.forEach(addTransactionDOM);
		});
});

const getBalance = async() => {
	try {
 const balance = await contract.methods.getBalance().call({from: accounts[0]});
 $('#balance').html("$" + balance);
 console.log("balance: " + balance);
	} catch (error) {
		console.log("balance error: ", error);
	} 
};

const getExpense = async() => {
	try {
 const expense = await contract.methods.getExpense().call({from: accounts[0]});
 $('#money-minus').html("$" + expense);
 console.log("expense: " + expense);
	} catch (error) {
		console.log("expense error: " + error);
	} 
};

const getIncome = async() => {
	try {
 const income = await contract.methods.getIncome().call({from: accounts[0]});
 $('#money-plus').html("$" + income);
 console.log("income: " + income);
	} catch (error) {
		console.log("income error: " + error);
	} 
};


const getTransactionData = async() => {
	try{
		const idArray = await contract.methods.getIndexArray().call({from: accounts[0]});
		for(let i = 0; i < idArray.length; i++) {
			txData[i] = await contract.methods.getTransaction(idArray[i]).call({from: accounts[0]});
			console.log("txData: " + txData[i].id);
		}
		txArray.push(txData);
console.log("txArray: " + txArray);
	} catch {
		console.log("tx error: ", error);
	}
}

const deleteTransaction = async(id) => {
	
	console.log("id: ", id);
try {
	const deleteTx = await contract.methods.deleteTransaction(id).send({from: accounts[0]});
} catch (error) {
	console.log("delete transaction error: " + error);
}
}

const transactionBtn = document.querySelector('.transaction');

transactionBtn.addEventListener('click', () => {
	getBalance();
	getExpense();
	getIncome();
	getTransactionData();
})

let transactions = [];

// Add transaction
const addTransaction = async(e) => {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    };
    addTransactionFunc(transaction.id, transaction.text, transaction.amount);
    transactions.push(transaction);

    // updateValues();

    // updateLocalStorage();

    text.value = '';
    amount.value = '';
    
  }
}
async function addTransactionFunc(id, text, value) {
  console.log("data: ", id, text, amount);
  try {
    const receipt = await contract.methods.addTransaction(id, text, value).send({from: accounts[0]});
    console.log("receipt: " + receipt);
  } catch (err) {
    console.log("error", err);
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(txData) {
console.log("txDataaa: ", txData);
console.log("data length: ", txData.length);
	for(let i = 0; i < txData.length; i++) {
  // Get sign
  const sign = txData.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(txData[i].amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${txData[i].text} <span>${sign}${Math.abs(
		txData[i].amount
  )}</span> <button class="delete-btn" onclick="deleteTransaction(${
    txData[i].id
  })">x</button>
  `;

  list.appendChild(item);
}
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  init();
}

// Init app
function init() {
  list.innerHTML = '';
}

init();
form.addEventListener('submit', addTransaction);