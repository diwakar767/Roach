import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import productService from "../../redux/features/product/productService";
import { messageFrom, restockProduct } from "../../services/shopService";
import { addCartItem } from "../../utils/cart";
import CameraCapture from "../../components/camera/CameraCapture";
import "../../components/camera/CameraCapture.scss";
import "../shop/shop.scss";

const Stock = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [restockQty, setRestockQty] = useState("1");
    const [sellQty, setSellQty] = useState("1");
    const [note, setNote] = useState("");
    const [image, setImage] = useState(null);
    const [cameraOpen, setCameraOpen] = useState(false);

    const load = async () => {
        try {
            const data = await productService.getProduct(id);
            setProduct(data);
        } catch (error) {
            toast.error(messageFrom(error));
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    const restock = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("productId", id);
        formData.append("quantity", restockQty);
        formData.append("note", note);
        if (image) {
            formData.append("image", image);
        }
        try {
            const updated = await restockProduct(formData);
            setProduct(updated);
            setNote("");
            setImage(null);
            window.dispatchEvent(new Event("roach-notifications"));
            toast.success("Stock added");
        } catch (error) {
            toast.error(messageFrom(error));
        }
    };

    const addToCheckout = (event) => {
        event.preventDefault();
        const quantity = Number(sellQty);
        if (!Number.isInteger(quantity) || quantity < 1) {
            toast.error("Enter a whole number of units");
            return;
        }
        if (quantity > Number(product.quantity)) {
            toast.error("That is more than the quantity on hand");
            return;
        }
        addCartItem({
            productId: product._id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            quantityOnHand: Number(product.quantity),
            quantity
        });
        toast.success("Added to checkout");
    };

    if (!product) {
        return <p className="--mt">Loading product...</p>;
    }

    return (
        <div className="shop-card">
            <h3 className="--mt">{product.name}</h3>
            <p>SKU {product.sku} · {product.quantity} on hand · ₹{product.price}</p>
            {product.image && product.image.filePath && (
                <img src={product.image.filePath} alt={product.name} style={{ maxWidth: "240px" }} />
            )}

            <h4>Restock</h4>
            <form onSubmit={restock}>
                <label>Units to add</label>
                <input type="number" min="1" step="1" value={restockQty} onChange={(event) => setRestockQty(event.target.value)} />
                <label>Note</label>
                <input type="text" value={note} onChange={(event) => setNote(event.target.value)} />
                <label>Replace photo</label>
                <input type="file" accept="image/png,image/jpeg" onChange={(event) => setImage(event.target.files[0])} />
                <button type="button" className="--btn --btn-secondary" onClick={() => setCameraOpen(true)}>Use camera</button>
                {cameraOpen && (
                    <CameraCapture
                        onCapture={(file) => {
                            setImage(file);
                            setCameraOpen(false);
                        }}
                        onClose={(message) => {
                            setCameraOpen(false);
                            if (message) {
                                toast.error(message);
                            }
                        }}
                    />
                )}
                {image && <p>Photo ready: {image.name}</p>}
                <div className="shop-actions">
                    <button type="submit" className="--btn --btn-primary">Add stock</button>
                </div>
            </form>

            <h4>Checkout</h4>
            <form onSubmit={addToCheckout}>
                <label>Units to sell</label>
                <input type="number" min="1" step="1" value={sellQty} onChange={(event) => setSellQty(event.target.value)} />
                <div className="shop-actions">
                    <button type="submit" className="--btn --btn-primary">Add to checkout</button>
                    <Link to="/checkout" className="--btn --btn-secondary">Review checkout</Link>
                </div>
            </form>
        </div>
    );
};

export default Stock;
