const KEY = "roach-checkout-cart";

export const readCart = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(KEY));
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

export const writeCart = (items) => {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("roach-cart"));
};

export const addCartItem = (item) => {
    const cart = readCart();
    const existing = cart.find((line) => line.productId === item.productId);
    if (existing) {
        existing.quantity += item.quantity;
        existing.quantityOnHand = item.quantityOnHand;
        existing.name = item.name;
        existing.price = item.price;
        existing.sku = item.sku;
    } else {
        cart.push(item);
    }
    writeCart(cart);
    return cart;
};

export const updateCartQuantity = (productId, quantity) => {
    const cart = readCart().map((line) => {
        if (line.productId !== productId) {
            return line;
        }
        return { ...line, quantity };
    });
    writeCart(cart);
    return cart;
};

export const removeCartItem = (productId) => {
    const cart = readCart().filter((line) => line.productId !== productId);
    writeCart(cart);
    return cart;
};

export const clearCart = () => {
    writeCart([]);
};
