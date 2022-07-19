const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    ImgName: String,
    ImgURL: String,
    ImgDetails: String
});
module.exports = mongoose.model('Image', ImageSchema);