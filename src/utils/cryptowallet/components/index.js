const Nairacoin = require ("../build/contracts/Nairacoin.json");
const { getWeb3 } = require("./getWeb3");
const { web3 } = require("web3");

const abi = require("../build/etherabi/etherscontract.json");
const { getEthers } = require("./getEthers");
const { ethers } = require("ethers");

export function connection(userPrivateKey) {
    // Wallet Settings and Connections
    var wallet = await new ethers.Wallet(userPrivateKey, getEthers);

    let contractAddress = "0xfB3a80C5032086ce1df57d96Aa7521A6421C17F6";

    // Connecting to the Contract on the chain
    let contract = new ethers.Contract(contractAddress, abi, getEthers);

    // Current user's Signer Object
    let contractWithSigner = contract.connect(wallet);

    return contractWithSigner;
}

// Create a New Rever Wallet but any user
export async function createWallet() {
  
    let walletObject = ethers.Wallet.createRandom();

    console.log(walletObject);
    return walletObject;
}

// Function to Restore user's wallet
export async function restoreWallet(mnemonic) {
  if (mnemonic.split(" ").length === 12) {
    let walletObject = ethers.Wallet.fromMnemonic(mnemonic);
    
      return walletObject
  }
}


// Get the cNaira Total Supply.
export async function totalSupply() {

    const supplyInWei = await connection.totalSupply();
    const supply = web3.utils.fromWei(supplyInWei.toString(), "ether");
    
    return supply;
}
    
    
// Getting the user's accounts balance.
export async function balance(wallet) {

    const balanceInWei = await connection.balanceOf(wallet.address);
    const balance = web3.utils.fromWei(balanceInWei.toString(), "ether");

    return balance;
}


// Function for Rever Token transfer.
export async function transferRever(recipient, transferAmt) {

  try {
    // Converting the number of token to transfer to Wei
    let transferAmtToWei = web3.utils.toWei(transferAmt, "ether");

    let tx = await connection.transfer(recipient, transferAmtToWei);

    await tx.wait();

    console.log(transferAmtToWei, " cNaira was transfered (Wei)");
  } catch (err) {
    console.log(err);
  }
}

// Function to issue cNaira and pay the admin account
export async function issueRever(issueAmount) {
  let issueAmtToWei = web3.utils.toWei(issueAmount, "ether");

  let tx = await connection.issue(issueAmtToWei);
    
    await tx.wait();
    
  console.log(issueAmount, "cNaira was issued...");
}

// Function to Redeem cNaira
export async function redeemRever(redeemAmount) {

  // Converting the ammount to Redeem to Wei
  let amtToWei = web3.utils.toWei(redeemAmount, "ether");

  // Invoking the contract on redeem function
  let tx = await connection.redeem(amtToWei);
  
    await tx.wait();
  
    console.log(amtToWei, "Tokens were redeemed ... ");
}

// Function to pause/unpause the contract for an emergency stop
export async function emergencyStop() {
  
  try {
    // Calling the Contract to pause/unpause
    let stop = await connection.paused();

    if (stop) {
        let tx = await connection.unpause();
      await tx.wait();
      console.log("Contract was unpaused...");
    } else {
        let tx = await connection.pause();
      await tx.wait();
      console.log("Contract was paused...");
    }
  } catch (err) {
    console.log(err);
  }
}
