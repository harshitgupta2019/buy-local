const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: String,
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: String,
  stock: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  image: {
    type: String,
    default: '', 
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);