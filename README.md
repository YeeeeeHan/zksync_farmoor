# Zk Sync Industrial Farm

For fellow farmoors

### Project Setup

To set up this Node.js project, follow these steps:

1. Clone the repository

2. Install dependencies using Yarn:

   ```BASH
   yarn install
   ```

3. Create a `.env` file in the project root and fill in the following environment variables. An refer to `.env.example`:

   ```BASH
   PRIVATE_KEY_1=YOUR_PRIVATE_KEY_1
   PRIVATE_KEY_2=YOUR_PRIVATE_KEY_2
   RPC_ENDPOINT=YOUR_RPC_ENDPOINT # Obtain a free zksync node at https://account.nownodes.io/
   ```

4. Update the following variables in `index.js` according to your preference:

   ```js
   // Script inputs
   // 1. Amount to transfer for each transaction, in Ether
   const TRANSFER_SIZE = "0.0000005"; // $0.00115 USD
   // 2. Number of transactions to send
   const TX_COUNT = 10;
   ```

5. Switch on the engines to the farm:

   ```js
   yarn start
   ```
