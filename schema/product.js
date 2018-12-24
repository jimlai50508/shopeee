var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    product: String,
    seller: String,
    images: [],
    price: Number,
    stock: Number,
    productToken: {
    	type: String, 
    	index: {unique: true}
    },
    editToken: {
        type: String, 
        index: {unique: true}
    },
    deleteToken: {
        type: String, 
        index: {unique: true}
    },
    category: String,
    subcategory: String,
    description: String,
    favoriter: [],
    postTime: Number
});

var product = mongoose.model('products', productSchema );

module.exports = product;