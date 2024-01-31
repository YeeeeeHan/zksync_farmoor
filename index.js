// Import from .env
const ethers = require("ethers");
require("dotenv").config();

// Script inputs
// 1. Amount to transfer for each transaction, in Ether
const TRANSFER_SIZE = "0.0000005"; // $0.00115 USD
// 2. Number of transactions to send
const TX_COUNT = 10;

const PK1 = process.env.PRIVATE_KEY_1;
const PK2 = process.env.PRIVATE_KEY_2;
const RPC_ENDPOINT = process.env.RPC_ENDPOINT;

const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);

const Wallet1 = new ethers.Wallet(PK1, provider);
const Wallet2 = new ethers.Wallet(PK2, provider);

// Convert Ether value to Wei (1 Ether = 10^18 Wei)
const valueInEtherToTransfer = TRANSFER_SIZE;
const valueInWei = ethers.utils.parseEther(valueInEtherToTransfer.toString());

const transfer = async (source, destination, valueInWei) => {
  // Gas in wei
  const gasPriceInWei = await provider.getGasPrice();

  const tx = {
    to: destination.address,
    value: valueInWei,
    gasLimit: 625496,
    gasPrice: gasPriceInWei,
  };

  try {
    const txResponse = await source.sendTransaction(tx);
    console.log("Transaction hash:", txResponse.hash);
  } catch (error) {
    // console.error("Error:", error);
  }
};

const eth_getBalance = async (i) => {
  try {
    const balance1 = await provider.getBalance(Wallet1.address);
    const balance2 = await provider.getBalance(Wallet2.address);
    console.log(`${i}. Wallet1 balance: ${ethers.utils.formatEther(balance1)}`);
  } catch (error) {
    // console.log(error);
  }
};

const run = async () => {
  // Repeat 10 times:
  for (let i = 0; i < TX_COUNT; i++) {
    try {
      // Get ETH initial balance of Wallet1 and Wallet2
      await eth_getBalance(i);

      // Transfer ETH from Wallet1 to Wallet2
      await transfer(Wallet1, Wallet2, valueInWei);
    } catch (error) {
      continue;
    }
  }
};

run();
