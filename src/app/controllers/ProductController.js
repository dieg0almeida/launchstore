const Category = require('../models/Category');

module.exports = {

    create(req, res){
        Category.all()
        .then(function(results){
            return res.render('products/create.njk', { categories: results[0] });
        }).catch(function(err){
            throw new Error(err);
        });
    }
}