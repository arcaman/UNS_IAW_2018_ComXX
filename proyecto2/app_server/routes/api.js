var express = require('express');
var router = express.Router();
const pizzaApi = require('../controllers/pizzaAPI');

/* GET pizzas page. Comme on est sur /api sur le fichier app.js, 
 * l'url sera localhost:3000/api/pizzas */
router.get('/pizzas', pizzaApi.getPizzas);

module.exports = router;
