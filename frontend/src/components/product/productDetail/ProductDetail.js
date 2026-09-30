import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import useRedirectLoggedOutUser from '../../../customHook/useRedirectLoggedOutUser';
import { selectIsLoggedIn } from '../../../redux/features/auth/authSlice';
import { getProduct } from '../../../redux/features/product/productSlice';
import Card from '../../card/Card';
import { SpinnerImg } from '../../loader/Loader';
import "./ProductDetail.scss";
import DOMPurify from "dompurify";
import { QRCodeCanvas } from "qrcode.react";

const ProductDetail = () => {
    useRedirectLoggedOutUser("/login");
    const dispatch = useDispatch();

    const {id} = useParams();
    const qrRef = useRef(null);

    const isLoggedIn = useSelector(selectIsLoggedIn);
    const {product, isLoading, isError, message} = useSelector((state) => state.product);

    const stockStatus = (quantity) => {
        if(quantity > 0) {
            return <span className='--color-success'>In Stock</span>
        }
        return <span className='--color-danger'>Out of Stock</span>
    }

    useEffect(() => {
        if(isLoggedIn === true) {
        dispatch(getProduct(id))
        }

        if(isError) {
        console.log(message);
        }

    }, [isLoggedIn, isError, message, dispatch, id]);

    const downloadQr = () => {
        const canvas = qrRef.current && qrRef.current.querySelector("canvas");
        if (!canvas) {
            return;
        }
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${product.sku || "product"}.png`;
        link.click();
    };

  const richText = (html) => ({ __html: DOMPurify.sanitize(html || "") });

  return (
    <div className='product-detail'>
        <h3 className='--mt'>Product Detail</h3>
        <Card cardClass="card">
            {isLoading && <SpinnerImg />}
            {product && (
                <div className='detail'>
                    <Card cardClass="group">
                        {product?.image ? (
                            <img src={product.image.filePath} alt={product.image.filename} />
                        ) : (<p>No image set for this product</p>)}
                    </Card>
                    <h4>Product Availability: {stockStatus(product.quantity)}</h4>
                    <hr />
                    <h4>
                        <span className='badge'>Name: </span> &nbsp; {product.name}
                    </h4>
                    <p>
                        <b>&rarr; SKU : </b> {product.sku}
                    </p>
                    <p>
                        <b>&rarr; Category : </b> {product.category}
                    </p>
                    <p>
                        <b>&rarr; Price : </b> {"₹"}{product.price}
                    </p>
                    <p>
                        <b>&rarr; Cost : </b> {"₹"}{product.cost || 0}
                    </p>
                    <p>
                        <b>&rarr; Quantity in stock : </b> {product.quantity}
                    </p>
                    <p>
                        <b>&rarr; Reorder level : </b> {product.reorderLevel ?? 5}
                    </p>
                    <p>
                        <b>&rarr; Total Value in stock : </b> {"₹"}{product.price * product.quantity}
                    </p>
                    <p>
                        <Link to={`/stock/${product._id}`}>Restock or sell</Link>
                    </p>
                    <hr />
                    <p><b>Description</b></p>
                    <div dangerouslySetInnerHTML={richText(product.description)}></div>
                    <p><b>Benefits</b></p>
                    <div dangerouslySetInnerHTML={richText(product.benefits)}></div>
                    <p><b>Use cases</b></p>
                    <div dangerouslySetInnerHTML={richText(product.useCases)}></div>
                    <hr />
                    <div ref={qrRef}>
                        <QRCodeCanvas value={`${window.location.origin}/scan/${product._id}`} size={160} />
                    </div>
                    <button type="button" className="--btn --btn-primary --mt" onClick={downloadQr}>Download QR</button>
                    <hr />
                    <code className='--color-dark'>Created on: {new Date(product.createdAt).toLocaleString("en-US")} </code>
                    <br />
                    <code className='--color-dark'>Last Updated: {product.updatedAt.toLocaleString("en-US")} </code>
                </div>
            )}
        </Card>
    </div>
  )
}

export default ProductDetail;