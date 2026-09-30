import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getInvoice, messageFrom } from "../../services/shopService";
import "../shop/shop.scss";

const InvoiceDetail = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);

    useEffect(() => {
        getInvoice(id).then(setInvoice).catch((error) => toast.error(messageFrom(error)));
    }, [id]);

    if (!invoice) {
        return <p className="--mt">Loading invoice...</p>;
    }

    return (
        <div>
            <h3 className="--mt">{invoice.number}</h3>
            <p>{new Date(invoice.createdAt).toLocaleString()}</p>
            {invoice.note && <p>Note: {invoice.note}</p>}
            <table className="shop-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Cost</th>
                        <th>Line</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.lines.map((line, index) => (
                        <tr key={`${line.sku}-${index}`}>
                            <td>{line.name}</td>
                            <td>{line.sku}</td>
                            <td>{line.quantity}</td>
                            <td>₹{line.unitPrice}</td>
                            <td>₹{line.unitCost}</td>
                            <td>₹{line.quantity * line.unitPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>Revenue ₹{invoice.subtotal}</p>
            <p>Cost ₹{invoice.costTotal}</p>
            <p>Profit ₹{invoice.profit}</p>
        </div>
    );
};

export default InvoiceDetail;
