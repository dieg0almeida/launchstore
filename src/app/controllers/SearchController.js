const Category = require('../models/Category');
const Product = require('../models/Product');
const File = require('../models/File');
const { formatPrice, date } = require('../../lib/utils');

module.exports = {
    async index(req, res) {
        try {
            let results;
            let params = {};

            const { filter, category } = req.query;

            if (!filter) return res.redirect('/');

            params.filter = filter;

            if (category) {
                params.category = category;
            }

            results = await Product.search(params);

            async function getImage(product_id) {
                results = await Product.files(product_id);

                let files = results[0];

                files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
                );

                return files[0];
            }

            const productsPromise = results[0].map(async product => {
                product.img = await getImage(product.id);
                product.old_price = formatPrice(product.old_price);
                product.price = formatPrice(product.price);
                return product;
            });

            const products = await Promise.all(productsPromise);

            const search = {
                term: req.params.filter,
                total: products.length
            }

            return res.render('search/index', { products });
        } catch (err) {
            console.log(err);
        }
    }
}