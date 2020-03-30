const express = require('express');
const routes = express.Router();
const users = require('./users');
const products = require('./products');

const HomeController = require('../app/controllers/HomeController');

//HOME
routes.get('/', HomeController.index);

routes.use('/products', products);
routes.use('/user', users);


//ALIAS
routes.get('/ads/create', function(req, res){
    res.redirect('/products/create');
});

routes.get('/accounts', function(req, res){
    res.redirect('/user/register');
})

module.exports = routes;