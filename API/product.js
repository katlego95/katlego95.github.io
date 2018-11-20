var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProductSchema = new Schema({


    title: String,
genre: String,
year: Number,
language: String,
length: String
});
module.exports = mongoose.model('Product', ProductSchema);
