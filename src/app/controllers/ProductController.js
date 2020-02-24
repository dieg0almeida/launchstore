const Category = require('../models/Category');
const Product = require('../models/Product');
const { formatPrice } = require('../../lib/utils');

module.exports = {

    create(req, res) {
        Category.all()
            .then(function (results) {
                return res.render('products/create.njk', { categories: results[0] });
            }).catch(function (err) {
                throw new Error(err);
            });
    },
    async post(req, res) {

        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all fields!");
            }
        }

        await Product.create(req.body);

        const results = await Product.findLastInsert();
        const { productId } = results[0];


        return res.redirect(`products/${productId}`);
    },
    async edit(req, res){

        let results = await Product.findById(req.params.id);
        const product = results[0][0];
        
        if(!product) return res.send("Product not found!");

        product.price = formatPrice(product.price);
        product.old_price = formatPrice(product.old_price);
        results = await Category.all();
        const categories = results[0];

        return res.render("products/edit.njk", { product, categories });

    },
    async put(req, res){
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Please, fill all fields!");
            }
        }

        req.body.price = req.body.price.replace(/\D/g, "");

        if(req.body.old_price != req.body.price){
            const oldProduct = await Product.findById(req.body.id);
            req.body.old_price = oldProduct[0][0].price;
        }

        await Product.update(req.body);

        return res.redirect(`/products/${req.body.id}/edit`);
    },
    async delete(req, res){
        await Product.destroy(req.body.id);

        res.render('products/create.njk');
    }
}