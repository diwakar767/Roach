import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Card from '../../card/Card';
import CameraCapture from '../../camera/CameraCapture';
import "../../camera/CameraCapture.scss";
import "./ProductForm.scss";
import { toast } from 'react-toastify';

const ProductForm = ({product, imagePreview, description, setDescription, benefits, setBenefits, useCases, setUseCases, handleInputChange, handleImageChange, saveProduct}) => {
  const [cameraOpen, setCameraOpen] = useState(false);

  const closeCamera = (message) => {
    setCameraOpen(false);
    if (message) {
      toast.error(message);
    }
  };

  return (
    <div className='add-product'>
        <Card cardClass={"card"}>
            <form onSubmit={saveProduct}>
                <Card cardClass={"group"}>
                    <label>Product Image</label>
                    <code className='--color-dark'>Supported Formats: jpg, jpeg, png</code>
                    <input type="file" name='image' onChange={(e) => handleImageChange(e)} />
                    <button type="button" className="--btn --btn-secondary" onClick={() => setCameraOpen(true)}>Use camera</button>
                    {cameraOpen && (
                        <CameraCapture
                            onCapture={(file) => {
                                handleImageChange(file);
                                setCameraOpen(false);
                            }}
                            onClose={closeCamera}
                        />
                    )}
                    {imagePreview != null ? (<div className='image-preview'><img src={imagePreview} alt="product" /></div>) : (<p>No image set for this product</p>)}
                </Card>
                <label>Product Name:</label>
                <input type="text" placeholder="Product Name" name="name" value={product?.name} onChange={handleInputChange} />
                
                <label>Product Category:</label>
                <input type="text" placeholder="Product Category" name="category" value={product?.category} onChange={handleInputChange} />

                <label>Product Price:</label>
                <input type="number" min="0" step="0.01" placeholder="Selling price" name="price" value={product?.price} onChange={handleInputChange} />

                <label>Product Cost:</label>
                <input type="number" min="0" step="0.01" placeholder="Cost price" name="cost" value={product?.cost} onChange={handleInputChange} />

                <label>Product Quantity:</label>
                <input type="number" min="0" step="1" placeholder="Product Quantity" name="quantity" value={product?.quantity} onChange={handleInputChange} />

                <label>Reorder Level:</label>
                <input type="number" min="0" step="1" placeholder="Reorder level" name="reorderLevel" value={product?.reorderLevel} onChange={handleInputChange} />

                <label>Product Description:</label>
                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={ProductForm.modules} formats={ProductForm.formats} />

                <label>Benefits:</label>
                <ReactQuill theme="snow" value={benefits} onChange={setBenefits} modules={ProductForm.modules} formats={ProductForm.formats} />

                <label>Use cases:</label>
                <ReactQuill theme="snow" value={useCases} onChange={setUseCases} modules={ProductForm.modules} formats={ProductForm.formats} />

                <div className='--my'>
                    <button type="submit" className="--btn --btn-primary"> Save Product </button>
                </div>
            </form>
        </Card>
    </div>
  );
};

ProductForm.modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["clean"],
    ],
  };
  ProductForm.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "video",
    "image",
    "code-block",
    "align",
  ];

export default ProductForm