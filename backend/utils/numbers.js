const parseQuantity = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || !Number.isInteger(number)) {
        return null;
    }
    return number;
};

const parseMoney = (value) => {
    if (value === undefined || value === null || value === "") {
        return 0;
    }
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) {
        return null;
    }
    return Math.round(number * 100) / 100;
};

module.exports = {
    parseQuantity,
    parseMoney,
};
