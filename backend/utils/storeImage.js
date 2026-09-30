const cloudinary = require("cloudinary").v2;
const { fileSizeFormatter } = require("./fileUpload");

const cloudinaryConfigured = () => {
    return Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    );
};

const storeUploadedImage = async (file) => {
    if (cloudinaryConfigured()) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const uploadedFile = await cloudinary.uploader.upload(file.path, {
            folder: "Roach",
            resource_type: "image",
        });

        return {
            fileName: file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: file.mimetype,
            fileSize: fileSizeFormatter(file.size, 2),
        };
    }

    return {
        fileName: file.originalname,
        filePath: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        fileSize: fileSizeFormatter(file.size, 2),
    };
};

module.exports = { storeUploadedImage, cloudinaryConfigured };
