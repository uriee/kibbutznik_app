const ethers = require('ethers');

const providerURL = 'https://rpc-mainnet.matic.network'; // Polygon Mainnet
const contractAddress = '0xYourContractAddress'; // USDT contract address
async function getBalance(accountAddress) {
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const balance = await contract.getBalance(accountAddress);
    return ethers.utils.formatUnits(balance, 6); // USDT has 6 decimal places
}

async function transfer(fromPrivateKey, toAddress, amount) {
    const provider = new ethers.providers.JsonRpcProvider(providerURL);
    const wallet = new ethers.Wallet(fromPrivateKey, provider);

    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const tx = await contract.transferIfSufficientBalance(wallet.address, toAddress, ethers.utils.parseUnits(amount, 6));
    await tx.wait();

    console.log('Transfer successful!');
}


const privateKey = 'YourPrivateKey';
const receiverAddress = 'ReceiverAddress';
const abi = [ ... ]; // USDT contract ABI

getBalance(receiverAddress)
    .then(balance => console.log(`Balance: ${balance} USDT`))
    .catch(console.error);

transfer(contractAddress, privateKey, receiverAddress, '10', providerURL)
    .catch(console.error);