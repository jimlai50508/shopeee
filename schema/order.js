var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orderSchema = new Schema({
    time: String,
    buyer: String,
    total: Number,
    datas: []
});

var order = mongoose.model('orders', orderSchema );

module.exports = order;