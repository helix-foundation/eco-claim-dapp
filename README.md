# Eco Claim dApp
This dApp is designed to allow community members to claim their earned Eco and ECOx tokens based on the points balances associated with their social accounts.
Users must first connect a web3 wallet to interact with the dApp by clicking Connect Wallet.
Once connected, users can who verify their social accounts. Verified users are then able to claim token balances corresponding to the listed points balances by clicking the Claim button and then confirming the transaction appearing in their wallet extension. Notably, any claims submitted outside of displayed claim windows will fail. 

## Getting Started


After cloning the repo, run npm install to install all required packages. 

Next, be sure to set the required environment variables, notably the claim contract address. See .env.example for more details. 

To run the dApp locally: 

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration
In order to sync to a specific deployment of contracts, this dApp requires the following to be set up:

#### Environment
Use the env variable `NEXT_PUBLIC_ENVIRONMENT` to set the directory that the dapp will use when fetching the points and merkle tree from the [assets folder](./assets/). Use either `development`, `staging`, or `production`.

#### Chain
Use the env variable `NEXT_PUBLIC_CHAIN` to set the network that the dapp will allow users to connect on, (examples: `mainnet`, `goerli`, `localhost`)

#### Subgraph URI
This dApp uses the [nft-subgraph](https://github.com/eco-association/nft-subgraph) to get information about the EcoID and EcoClaim contracts, wherever the subgraph can be accessed for queries, assign that endpoint to the `NEXT_PUBLIC_SUBGRAPH_URI` env variable.

#### Points and Merkle files
Ensure that the [`assets/points.json`](./assets/points.json) and [`assets/merkle.json`](./assets/merkle.json) files are up to date for the deployment you are using. If the files is incorrect, your claims will most likely fail. You can verify that your merkle file is correct by checking that its root hash is equal to the root hash saved in the subgraph. If it matches but you are getting a `Your Claim does not match with a leaf in the tree` error before you try to claim, it's most likely that your points file does not match the merkle file you are using.

## Deployment

To build the site to static files:
```bash
npm run build
# or 
yarn build
```

then access the static files in the `out/` folder

there will also be a nextjs optimized production build that can be run in the `.next/` folder that can be run with:
```bash
npm start
# or
yarn start
```
## Contributing
Contributions are welcome. Please submit any issues as issues on GitHub, and open a pull request with any contributions.

## License
[MIT (c) Helix Foundation](./LICENSE)