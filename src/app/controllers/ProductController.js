const Category = require('../models/Category');
const Product = require('../models/Product');
const File = require('../models/File');
const { formatPrice, date } = require('../../lib/utils');

module.exports = {

    async show(req, res){
        let results = await Product.findById(req.params.id);

        const product = results[0][0];

        const datetime = new Date(product.created_at);
        const { hourFormat, format} = date(datetime.getTime());
        product.published = {
            hour: hourFormat,
            date: format
        }

        results = await Product.files(product.id);

        let files = results[0];

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        product.price = formatPrice(product.price);
        product.old_price = formatPrice(product.old_price);
        return res.render('products/show', {product, files});
    },
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

        if (req.files.length == 0){
            return res.send("Please, send at least one image!");
        }

        await Product.create(req.body);

        const results = await Product.findLastInsert();
        const productId = results[0][0].id;

        const filesPromise = req.files.map( file => File.create({
            ...file,
            product_id: productId
        }));

        await Promise.all(filesPromise);


        return res.redirect(`products/${productId}/edit`);
    },
    async edit(req, res){

        let results = await Product.findById(req.params.id);
        const product = results[0][0];
        
        if(!product) return res.send("Product not found!");

        product.price = formatPrice(product.price);
        product.old_price = formatPrice(product.old_price);


        results = await Category.all();
        const categories = results[0];

        results = await Product.files(product.id);

        let files = results[0];

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }));

        return res.render("products/edit.njk", { product, categories, files });

    },
    async put(req, res){
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send("Please, fill all fields!");
            }
        }

        if(req.files.length != 0){
            const newFiles = req.files.map(
                file => File.create({...file, product_id: req.body.id})
            );

            await Promise.all(newFiles);
        }

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;

            removedFiles.splice(lastIndex, 1);

            const removedFilesPromise = removedFiles.map( id => File.delete(id));

            await Promise.all(removedFilesPromise);
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
    },
}