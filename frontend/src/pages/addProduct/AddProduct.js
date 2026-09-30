import React, { useState } from 'react';
import ProductForm from '../../components/product/productForm/ProductForm';
import { useDispatch, useSelector } from "react-redux";
import { createProduct, selectIsLoading } from '../../redux/features/product/productSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/Loader';

const initialState = {
    name: "",
    category: "",
    quantity: "",
    price: "",
    cost: "0",
    reorderLevel: "5",
}

const AddProduct = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [product, setProduct] = useState(initialState);
    const [productImage, setProductImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [description, setDescription] = useState("");
    const [benefits, setBenefits] = useState("");
    const [useCases, setUseCases] = useState("");

    const isLoading = useSelector(selectIsLoading);

    const {name, category, price, cost, quantity, reorderLevel} = product;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({...product, [name]: value});
    }

    const handleImageChange = (eventOrFile) => {
        const file = eventOrFile?.target ? eventOrFile.target.files[0] : eventOrFile;
        if (!file) {
            return;
        }
        setProductImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const generateSKU = (category) => {
        const letter = category.slice(0, 3).toUpperCase()
        const number = Date.now();
        const sku = letter + "-" + number;
        return sku;
    }

    const saveProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("sku", generateSKU(category));
        formData.append("category", category);
        formData.append("quantity", quantity);
        formData.append("price", price);
        formData.append("cost", cost);
        formData.append("reorderLevel", reorderLevel);
        formData.append("description", description);
        formData.append("benefits", benefits);
        formData.append("useCases", useCases);
        if (productImage) {
            formData.append("image", productImage);
        }

        console.log(...formData);

        await dispatch(createProduct(formData));
        window.dispatchEvent(new Event("roach-notifications"));

        navigate("/dashboard");
    }

  return (
    <div>
        {isLoading && <Loader />}
        <h3 className='--mt'> Add New Product </h3>
        <ProductForm 
            product={product}
            productImage={productImage}
            imagePreview={imagePreview}
            description={description}
            setDescription={setDescription}
            benefits={benefits}
            setBenefits={setBenefits}
            useCases={useCases}
            setUseCases={setUseCases}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            saveProduct={saveProduct}
        />
    </div>
  )
}

export default AddProduct