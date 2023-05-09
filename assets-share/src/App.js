import logo from './logo.svg';
import './App.css';
import { Button } from 'bootstrap';
import { NoWalletDetected } from './Components/NoWalletDetected';
import { useState } from 'react';
// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
import ListAsset from './Components/ListAsset';

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers


function App() {
  const [selectedAddress, setSelectedAddress] = useState("")

  const connectWallet = async () => {
    try {
      // Check if the browser supports Ethereum
      if (window.ethereum) {
        // Request access to the user's accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create an ethers.js provider using the current provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Get the signer (connected wallet) from the provider
        const signer = provider.getSigner();

        // Get the connected wallet address
        const address = await signer.getAddress();

        // Update the state with the wallet address
        setSelectedAddress(address);
      } else {
        // If the browser doesn't support Ethereum, display an error
        throw new Error('Ethereum not found');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Assets Share Purchase</h1>
        {selectedAddress ? (
          <>
          <p>Wallet connected: {selectedAddress}</p>
          <ListAsset/>
          </>
        ) : (
          <button className="connect-wallet-button" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

      </header>
    </div>
  );
}

export default App;
