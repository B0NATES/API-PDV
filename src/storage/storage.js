const s3 = require("../utils/image");
require("dotenv").config();

const uploadImage = async(image) => {
    const uploadImg = await s3.upload({
        Bucket: process.env.BACKBLAZE_BUCKET,
        Key: `produtos/${image.originalname}`,
        Body: image.buffer,
        ContentType: image.mimetype
    }).promise();
    return {
        url: uploadImg.Location, 
        path: uploadImg.Key
    };

}

const deleteImageProduct = async (path) => {
    try {
        await s3.deleteObject({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: path,
        });
    } catch (error) {
        return new Error(500);
    }
}

module.exports = {
    uploadImage,
    deleteImageProduct
}