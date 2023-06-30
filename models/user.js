// const mongoose = require('mongoose');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

  email: {
    type: String,
    required: true
  },
  password:{
    type:String,
    required:true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  console.log(cartProductIndex);
  console.log('caet wala');
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  console.log(updatedCartItems);
  console.log('items');

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    console.log(this.cart.items[cartProductIndex]);
    console.log('cart arr');
    console.log(this.cart.items[cartProductIndex].quantity);
    console.log('ert');
    console.log(newQuantity);
    console.log('quntityu adad');
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
    console.log(updatedCartItems);
    console.log('push wala seen');
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    
    return item.productId.toString() !== productId.toString();

  });
  console.log('down dekh');
  console.log(updatedCartItems);
  this.cart.items = updatedCartItems;
  return this.save();

};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

