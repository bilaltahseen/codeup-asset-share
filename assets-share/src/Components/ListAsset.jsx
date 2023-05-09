import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AssetContractArtifact from '../artifacts/contracts/AssetPurchase.sol/Asset.json';
import constants from '../constants';
import { ethers } from 'ethers';

function ListAsset() {
  const [assetName, setAssetName] = useState('');
  const [assetPrice, setAssetPrice] = useState('');

  const deployContract = async (price) => {
    try {
      // Get the provider
      const provider = new ethers.providers.JsonRpcProvider(constants.RPC_URL);
      console.log("🚩 ~ file: ListAsset.jsx:15 ~ deployContract ~ provider:", provider)

      // Get the signer (assumes a Metamask provider is connected)
      const signer = provider.getSigner();
      console.log("🚩 ~ file: ListAsset.jsx:18 ~ deployContract ~ signer:", signer)

      // Compile the contract artifact
      const contractJSON = AssetContractArtifact;
      const contractBytecode = contractJSON.bytecode;
      const contractAbi = contractJSON.abi;

      // Deploy the contract
      const factory = new ethers.ContractFactory(contractAbi, contractBytecode, signer);
      const contract = await factory.deploy(price);

      // Wait for the contract to be mined and get the contract address
      await contract.deployed();
      console.log('Contract deployed at address:', contract.address);
      return contract.address
    } catch (error) {
      console.error('Error deploying contract:', error);
    }
  };

  const handleSubmit = async e => {
    try {
        e.preventDefault();
    // Handle form submission
    console.log('Asset Name:', assetName);
    console.log('Asset Price:', assetPrice);
    // Reset inputs
    const address = await deployContract(assetPrice);
    console.log("🚩 ~ file: ListAsset.jsx:44 ~ handleSubmit ~ address:", address)
    localStorage.setItem(address,{
        "assetName": assetName,
        "assetPrice":assetPrice 

    })
    setAssetName('');
    setAssetPrice('');
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className="container w-50 mt-5">
      <h2>Create an asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="assetName" className="form-label">Asset Name:</label>
          <input
            type="text"
            id="assetName"
            className="form-control"
            value={assetName}
            onChange={e => setAssetName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="assetPrice" className="form-label">Asset Price:</label>
          <input
            type="text"
            id="assetPrice"
            className="form-control"
            value={assetPrice}
            onChange={e => setAssetPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default ListAsset;
