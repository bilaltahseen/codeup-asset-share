import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import AssetContractArtifact from '../artifacts/contracts/AssetPurchase.sol/Asset.json';
import { ethers } from 'ethers';

function AssetsList() {
    const [showModal, setShowModal] = useState(false);
    const [price, setPrice] = useState('');
    const [assets, setAssetsList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [assetsShare, setAssetsShare] = useState(0);
    const [isButtonLoading,setButtonLoading] = useState(false);

    const handlePurchase = async (contractAddress) => {
        setShowModal(true);
        await _getAssetsShare(contractAddress)
    };

    const handleSubmit = async () => {
        // Handle form submission with the price value
        // Reset price and close modal


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
            console.error('Error calling contract function:', error);
        } finally {
            setPrice('');
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
                                <Button onClick={() => { handlePurchase(a.address) }}>Purchase</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}

            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Price</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="price">
                            <Form.Label>Price:</Form.Label>
                            <Form.Control
                                type="text"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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
