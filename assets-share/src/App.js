import logo from './logo.svg';
import './App.css';
import { Button } from 'bootstrap';
import { ConnectWallet } from './Components/ConnectWallet';
import { NoWalletDetected } from './Components/NoWalletDetected';
import { useState } from 'react';
// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import AssetArtifact from "../artifacts/contracts/AssetPurchase.sol/Asset.json";
import contractAddress from "../contracts/contract-address.json";


function App() {
  const [selectedAddress,setSelectedAddress] = useState("")
  
  const _connectWallet = async () => {
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this._checkNetwork();
    this._initialize(selectedAddress);
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });
  }

  const _initialize=async(userAddress)=> {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    setSelectedAddress(userAddress)

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    _initializeEthers();
    _startPollingData();
  }

   const _initializeEthers=()=> {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._token = new ethers.Contract(
      contractAddress.Token,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>Assets Share Purchase</h1>
        <ConnectWallet
          connectWallet={() => _connectWallet()}
          networkError={networkError}
          dismiss={() => _dismissNetworkError()}
        />
      </header>
    </div>
  );
}

export default App;
