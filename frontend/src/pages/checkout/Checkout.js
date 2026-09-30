import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkoutCart, messageFrom } from "../../services/shopService";
import { clearCart, readCart, removeCartItem, updateCartQuantity } from "../../utils/cart";
import "../shop/shop.scss";

const Checkout = () => {
    const navigate = useNavigate();
    const [lines, setLines] = useState(readCart());
    const [note, setNote] = useState("");

    useEffect(() => {
        const refresh = () => setLines(readCart());
        window.addEventListener("roach-cart", refresh);
        return () => window.removeEventListener("roach-cart", refresh);
    }, []);

    const changeQty = (productId, value) => {
        const quantity = Number(value);
        if (!Number.isInteger(quantity) || quantity < 1) {
            return;
        }
        setLines(updateCartQuantity(productId, quantity));
    };

    const confirmSale = async (event) => {
        event.preventDefault();
        if (lines.length === 0) {
            toast.error("Add at least one product");
            return;
        }
        try {
            const invoice = await checkoutCart({
                note,
                lines: lines.map((line) => ({
                    productId: line.productId,
                    quantity: Number(line.quantity)
                }))
            });
            clearCart();
            window.dispatchEvent(new Event("roach-notifications"));
            toast.success("Checkout recorded");
            navigate(`/invoice/${invoice._id}`);
        } catch (error) {
            toast.error(messageFrom(error));
        }
    };

    const total = lines.reduce((sum, line) => sum + (Number(line.price) * Number(line.quantity)), 0);

    return (
        <div className="shop-page">
            <h3 className="--mt">Checkout</h3>
            {lines.length === 0 && <p>The cart is empty. Scan a product or open one from the search list.</p>}
            {lines.length > 0 && (
                <form onSubmit={confirmSale}>
                    <table className="shop-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Line</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lines.map((line) => (
                                <tr key={line.productId}>
                                    <td>{line.name}<br />{line.sku}</td>
                                    <td>₹{line.price}</td>
                                    <td>
                                        <input type="number" min="1" step="1" value={line.quantity} onChange={(event) => changeQty(line.productId, event.target.value)} />
                                    </td>
                                    <td>₹{Number(line.price) * Number(line.quantity)}</td>
                                    <td><button type="button" onClick={() => setLines(removeCartItem(line.productId))}>Remove</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p>Total ₹{total}</p>
                    <label>Note</label>
                    <input type="text" value={note} onChange={(event) => setNote(event.target.value)} />
                    <div className="shop-actions">
                        <button type="submit" className="--btn --btn-primary">Confirm checkout</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Checkout;
