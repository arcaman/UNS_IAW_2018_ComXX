const mongoose = require('mongoose');
const Pizza = mongoose.model('Pizza');

const getPizzas = function (req, res) {
  Pizza
    .find()
    .exec((err, pizzas) => {
      if (err) { 
        res.status(404).json(err);    
      } else {
        res.status(200).json(pizzas);
      }
    })
}

module.exports = { getPizzas };
