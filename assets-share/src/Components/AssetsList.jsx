import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import AssetContractArtifact from '../artifacts/contracts/AssetPurchase.sol/Asset.json';
import { ethers } from 'ethers';
import {toast} from 'react-toastify'
function AssetsList() {
    const [showModal, setShowModal] = useState(false);
    const [shares, setShares] = useState(0);
    const [assets, setAssetsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [assetsShare, setAssetsShare] = useState(0);
    const [isButtonLoading,setButtonLoading] = useState(false);
    const [currentContract,setContract] = useState({})

    const handlePurchase = async (asset) => {
        setContract({
            address:asset.address,
            assetPrice: asset.assetPrice
        })
        setShowModal(true);
        await _getAssetsShare(asset.address)
    };

    const handleSubmit = async (e) => {
        // Handle form submission with the Shares value
        // Reset Shares and close modal

        e.preventDefault()
        try {
            setButtonLoading(true)
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } else {
                throw new Error('MetaMask not detected!');
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // Get the signer
            const signer = provider.getSigner();

            // Create contract instance
            const contract = new ethers.Contract(currentContract.address, AssetContractArtifact.abi, signer);
            const amountToSend = ethers.utils.parseEther((parseInt(currentContract.assetPrice) * shares).toString())
            const transaction = {
                to: currentContract.address,
                value: amountToSend,
                data: contract.interface.encodeFunctionData("buyShares", [shares.toString()]),
              };

            // estimate gas
            const gasEstimate = await provider.estimateGas(transaction);

            transaction.gasLimit = gasEstimate.add(ethers.BigNumber.from('10000'));

            const sentTransaction = await provider.sendTransaction(transaction);
            console.log("🚩 ~ file: AssetsList.jsx:57 ~ handleSubmit ~ sentTransaction:", sentTransaction)
        } catch (error) {
            toast.error(error.message)
            console.error('Error calling contract function:', error);
        } finally {
            setButtonLoading(false);
            setShares(0);
            setShowModal(false);
        }

    };




    const _getAssetsShare = async (contractAddress) => {
        try {
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } else {
                throw new Error('MetaMask not detected!');
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // Get the signer
            const signer = provider.getSigner();

            // Create contract instance
            const contract = new ethers.Contract(contractAddress, AssetContractArtifact.abi, provider);

            // Call the contract function
            const result = await contract.totalShare()
            const readableResult = ethers.utils.formatEther(result)
            setAssetsShare(parseInt(readableResult))
        } catch (error) {
            toast.error(error.message)
            console.error('Error calling contract function:', error);
        }
    }

    const _getAssetsFromLocalStorage = async () => {
        setIsLoading(true)
        const assets = JSON.parse(localStorage.getItem("assets") || '[]')
        setAssetsList(assets)
        setIsLoading(false)
    }

    useEffect(() => {
        _getAssetsFromLocalStorage()
    }, {})

    if (isLoading) {
        return <div><p>Is Loading</p></div>
    }

    return (
        <div className="container mt-5">
            <h2>Card List</h2>
            <div className="row">
                {assets.map((a) => (
                    <div className="col-md-4">
                        <Card>
                            <Card.Body>
                                <Card.Title className='text-dark'>{a.assetName}</Card.Title>
                                <Card.Text className='text-dark'>{a.assetPrice} <span className='fs-5'>SepoliaETH</span></Card.Text>
                                <Button onClick={() => { handlePurchase(a) }}>Purchase</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}

            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Amount Of Shares To Buy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="shares">
                            <Form.Label>Shares:</Form.Label>
                            <Form.Control
                                type="number"
                                value={shares}
                                onChange={(e) => setShares(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Text>
                            Total Shares : {assetsShare}
                        </Form.Text>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AssetsList;
