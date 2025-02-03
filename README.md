# FundMe Contract Project

## Overview

This project is a decentralized funding contract built with Solidity and Hardhat. It allows users to fund the contract in ETH, and only the owner can withdraw the funds. The project integrates Chainlink price feeds to ensure that the minimum funding amount is equivalent to 50 USD.

## Features

- **Funding Functionality:** Users can fund the contract in ETH.
- **Price Conversion:** Utilizes Chainlink price feeds for ETH to USD conversion.
- **Ownership Control:** Only the owner can withdraw funds.
- **Security:** Includes custom error handling and access control using modifiers.
- **Tests:** Contains unit tests for core functionality using Mocha and Chai.

## Project Structure

### Contracts

- `FundMe.sol`: The main contract with funding and withdrawal logic.
- `PriceConverter.sol`: A library to convert ETH to USD using Chainlink price feeds.

### Tests

- `FundMe.test.js`: Unit tests for the FundMe contract.

### Deployment Scripts

- `deploy.js`: Deploys the FundMe contract using Hardhat-deploy.
- `fund.js`: A script to fund the contract.

## Prerequisites

- Node.js
- Hardhat
- Chainlink Price Feeds

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/datokorgalidze/hardhat_fundMe.git
   cd fundme-project
   Install dependencies:
   ```

```bash
Copy
Edit
npm install
Set up environment variables:

Create a .env file and add the following:
```

```bash
Copy
Edit
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
Usage
Compile Contracts
```

````bash
Copy
Edit
npx hardhat compile
Deploy Contracts
bash
Copy
Edit
npx hardhat deploy --network localhost
Run Scripts
Fund the contract:

```bash
Copy
Edit
npx hardhat run scripts/fund.js --network localhost
Withdraw the funds:
````

```bash
Copy
Edit
npx hardhat run scripts/withdraw.js --network localhost
Run Tests
bash
Copy
Edit
npx hardhat test
License
This project is licensed under the MIT License.

Author
David Korgalidze
Feel free to connect with me for any questions or feedback!
```
