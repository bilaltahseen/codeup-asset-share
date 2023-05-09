import React, { useState } from 'react';

function AssetsList() {
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState('');
  const [assets,setAssetsList] = useState([]);
  const handlePurchase = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    // Handle form submission with the price value
    console.log('Price:', price);
    // Reset price and close modal
    setPrice('');
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h2>Card List</h2>
      <div className="row">
        {assets.map((a)=>(
             <div className="col-md-4">
             <div className="card">
               <div className="card-body">
                 <h5 className="card-title">{a.name}</h5>
                
                 <button
                   className="btn btn-primary"
                   onClick={handlePurchase}
                 >
                   Purchase
                 </button>
               </div>
             </div>
           </div>
        ))}
       
      </div>

     
    </div>
  );
}

export default AssetsList;
