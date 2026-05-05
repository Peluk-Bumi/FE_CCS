require("@nomicfoundation/hardhat-ethers");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const AMOY_RPC_URL =
  process.env.POLYGON_AMOY_URL ||
  process.env.VITE_POLYGON_AMOY_RPC_URL ||
  process.env.VITE_POLYGON_RPC_URL ||
  "https://rpc-amoy.polygon.technology";
const POLYGON_MAINNET_RPC_URL =
  process.env.POLYGON_MAINNET_URL ||
  process.env.VITE_POLYGON_MAINNET_RPC_URL ||
  "https://polygon-rpc.com";

module.exports = {
  solidity: "0.8.19",
  networks: {
    polygonAmoy: {
      type: "http",
      url: AMOY_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80002,
      gasPrice: "auto",
    },
    polygon: {
      type: "http",
      url: POLYGON_MAINNET_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 137,
      gasPrice: "auto",
    }
  }
};