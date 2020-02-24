const db = require('../../config/db');

module.exports = {
    create(data){
        const query = `INSERT INTO
         products (category_id, user_id, name, description, old_price, price, quantity, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        data.price = data.price.replace(/\D/g, "");

        const values = [
            data.category_id,
            data.user_id || 1,
            data.name,
            data.description,
            data.old_price || data.price,
            data.price,
            data.quantity,
            data.status || 1
        ];
        return db.promise().query(query, values);
    },
    findLastInsert(){
        return db.promise().query('SELECT * FROM launchstore.products order by id desc limit 1');
    },
    findById(id){
        return db.promise().query(`SELECT * FROM products WHERE id = ${id}`);
    },
    update(data){
        const query = `UPDATE products SET
         name = ?,
         user_id = ?,
         category_id = ?,
         description = ?,
         old_price = ?,
         price = ?,
         quantity = ?,
         status = ?
         WHERE id = ?`;

         const values = [
             data.name,
             data.user_id,
             data.category_id,
             data.description,
             data.old_price,
             data.price,
             data.quantity,
             data.status,
             data.id
         ];

         return db.promise().query(query, values);
    },
    destroy(id){
        return db.promise().query(`DELETE FROM products WHERE id = ${id}`);
    }
}