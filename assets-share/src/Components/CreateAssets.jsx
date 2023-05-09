import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AssetContractArtifact from '../artifacts/contracts/AssetPurchase.sol/Asset.json';
import constants from '../constants';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

function CreateAssets() {
    const [assetName, setAssetName] = useState('');
    const [assetPrice, setAssetPrice] = useState('');
    const [isLoading, setLoading] = useState(false)

    const deployContract = async (price) => {
        try {
            // Connect to the user's MetaMask provider
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } else {
                throw new Error('MetaMask not detected!');
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // Get the signer
            const signer = provider.getSigner();

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
            toast.error(error.message)
            console.error('Error deploying contract:', error);
        }
    };

    const handleSubmit = async e => {
        try {
            setLoading(true)
            e.preventDefault();
            // Handle form submission
            console.log('Asset Name:', assetName);
            console.log('Asset Price:', assetPrice);
            // Reset inputs
            const address = await deployContract(assetPrice);
            if(!address){
                throw new Error("Something went wrong!")
            }
            let currentAssets = localStorage.getItem("assets")
            if (!currentAssets) {
                currentAssets = []
            } else {
                currentAssets = JSON.parse(currentAssets)
            }
            const newAsset = {
                address,
                assetName,
                assetPrice,
            }
            currentAssets.push(newAsset)
            localStorage.setItem("assets", JSON.stringify(currentAssets))
            setAssetName('');
            setAssetPrice('');
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
        finally {
            setLoading(false)
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
                <button disabled={isLoading} type="submit" className="btn btn-primary">{isLoading ? "Please Wait." : "Submit"}</button>
            </form>
        </div>
    );
}

export default CreateAssets;
