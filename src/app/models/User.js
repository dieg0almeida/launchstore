const db = require('../../config/db');
const { hash } = require('bcryptjs');

module.exports = {
    findOne(email, cpf_cnpj) {
        const query = `SELECT * FROM users 
        WHERE email LIKE '${email}' 
        OR cpf_cnpj LIKE '${cpf_cnpj}'`;

        return db.promise().query(query);
    },
    async create(user) {
        const query = `INSERT INTO users (
            name,
            email,
            password,
            cpf_cnpj,
            cep,
            address
        )
        VALUES (?, ?, ?, ?, ?, ?)`;

        const passwordHash = await hash(user.password, 8);

        values = [
            user.name,
            user.email,
            passwordHash,
            user.cpf_cnpj.replace(/\D/g, ""),
            user.cep.replace(/\D/g, ""),
            user.address
        ];

        return db.promise().query(query, values);
    },
    findLastInsert() {
        return db.promise().query('SELECT id FROM launchstore.users order by id desc limit 1');
    },
    findById(id) {
        const query = `SELECT * FROM users 
        WHERE id = ${id}`;

        return db.promise().query(query);
    },
    update(user) {
        const query = `UPDATE users SET
        name = ?,
        email = ?,
        cpf_cnpj = ?,
        cep = ?,
        address = ?
        WHERE id = ?
        `;

        const values = [
            user.name,
            user.email,
            user.cpf_cnpj,
            user.cep,
            user.address,
            user.id
        ];

        return db.promise().query(query, values);
    }
}