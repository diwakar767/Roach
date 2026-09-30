import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/loader/Loader';
import ProductForm from '../../components/product/productForm/ProductForm';
import { getProduct, getProducts, selectIsLoading, selectProduct, updateProduct } from '../../redux/features/product/productSlice';

const EditProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsLoading);

    const productEdit = useSelector(selectProduct);

    const [product, setProduct] = useState(productEdit);
    const [productImage, setProductImage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [description, setDescription] = useState("");
    const [benefits, setBenefits] = useState("");
    const [useCases, setUseCases] = useState("");

    useEffect(() => {
      dispatch(getProduct(id))
    }, [dispatch, id])

    useEffect(() => {
        setProduct(productEdit)

        setImagePreview(
            productEdit && productEdit.image ? `${productEdit.image.filePath}` : null
        )

        setDescription(
            productEdit && productEdit.description ? productEdit.description : ""
        )
        setBenefits(
            productEdit && productEdit.benefits ? productEdit.benefits : ""
        )
        setUseCases(
            productEdit && productEdit.useCases ? productEdit.useCases : ""
        )
    }, [productEdit])

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

    const saveProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", product?.name);
        formData.append("category", product?.category);
        formData.append("quantity", product?.quantity);
        formData.append("price", product?.price);
        formData.append("cost", product?.cost ?? 0);
        formData.append("reorderLevel", product?.reorderLevel ?? 5);
        formData.append("description", description);
        formData.append("benefits", benefits);
        formData.append("useCases", useCases);
        if(productImage) {
            formData.append("image", productImage);
        }

        console.log(...formData);

        await dispatch(updateProduct({id, formData}));
        await dispatch(getProducts());
        window.dispatchEvent(new Event("roach-notifications"));

        navigate("/dashboard");
    }
    

  return (
    <div>
        {isLoading && <Loader />}
        <h3 className='--mt'> Edit Product </h3>
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
  );
}

export default EditProduct;