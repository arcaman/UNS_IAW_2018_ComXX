const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  precio: Number
});

mongoose.model('Pizza', pizzaSchema);