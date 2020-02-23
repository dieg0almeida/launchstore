const db = require('../../config/db');

module.exports = {
    all(){
        return db.promise().query(`SELECT * FROM categories`);
    }
}