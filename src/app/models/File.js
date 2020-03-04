const db = require('../../config/db');
const fs = require('fs');

module.exports = {
    create({ filename, path, product_id }){
        const query = 'INSERT INTO files (name, path, product_id) VALUES (?, ?, ?)';

        values = [
            filename,
            path,
            product_id
        ];

        return db.promise().query(query, values);
    },
    async delete(id){
        try {
            const results = await db.promise().query(`SELECT * FROM files WHERE id = ${id}`);
            const path = results[0][0].path;

            fs.unlinkSync(path);

            return db.promise().query(`DELETE FROM files WHERE id = ${id}`);
        } catch (error) {
            console.error(error);
        }
    }
}