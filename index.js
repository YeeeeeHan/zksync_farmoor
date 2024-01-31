// Import from .env
const ethers = require("ethers");
require("dotenv").config();

// Script inputs
// 1. Amount to transfer for each transaction, in Ether
const TRANSFER_SIZE = "0.0000005"; // $0.00115 USD
// 2. Number of transactions to send
const TX_COUNT = 3;

const PK1 = process.env.PRIVATE_KEY_1;
const PK2 = process.env.PRIVATE_KEY_2;
const RPC_ENDPOINT = process.env.RPC_ENDPOINT;

const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);

const Wallet1 = new ethers.Wallet(PK1, provider);
const Wallet2 = new ethers.Wallet(PK2, provider);

// Convert Ether value to Wei (1 Ether = 10^18 Wei)
const valueInEtherToTransfer = TRANSFER_SIZE;
const valueInWeiToTransfer = ethers.utils.parseEther(
  valueInEtherToTransfer.toString()
);

const transfer = async (i, source, destination, valueInWei) => {
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
    console.log(`${i}) Transaction hash: ${txResponse.hash}`);
  } catch (error) {
    console.error("Error:", error);
  }
};

const run = async () => {
  // Get initial balances
  const initial_balance1 = await provider.getBalance(Wallet1.address);
  const initial_balance2 = await provider.getBalance(Wallet2.address);
  console.log(
    `Wallet1 initial balance: ${ethers.utils.formatEther(initial_balance1)}\n` +
      `Wallet2 initial balance: ${ethers.utils.formatEther(initial_balance2)}\n`
  );

  let total_success = 0;

  // Repeat TX_COUNT times:
  for (let i = 0; i < TX_COUNT; i++) {
    try {
      // Transfer ETH from Wallet1 to Wallet2
      await transfer(i, Wallet1, Wallet2, valueInWeiToTransfer);
    } catch (error) {
      continue;
    }

    total_success += 1;
  }

  // Get final balances
  const final_balance1 = await provider.getBalance(Wallet1.address);
  const final_balance2 = await provider.getBalance(Wallet2.address);
  console.log(
    `\nWallet1 final balance: ${ethers.utils.formatEther(final_balance1)}\n` +
      `Wallet2 final balance: ${ethers.utils.formatEther(final_balance2)}`
  );
  const total_out = initial_balance1.sub(final_balance1);
  const total_transfer_out = valueInWeiToTransfer.mul(
    ethers.BigNumber.from(total_success)
  );
  const total_gas_expenditure = total_out.sub(total_transfer_out);
  console.log(
    `\nTotal Successful Transfers: ${total_success}\n` +
      `Total Transfer Value: ${ethers.utils.formatEther(
        total_transfer_out
      )} ETH\n` +
      `Total Gas Expenditure: ${ethers.utils.formatEther(
        total_gas_expenditure
      )} ETH = $${Number(ethers.utils.formatEther(total_out)) * 2330}`
  );
};

run();
