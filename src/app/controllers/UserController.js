const User = require('../models/User');
const { formatCpfCnpj, formatCep } = require('../../lib/utils');
const session = require('../../config/session');

module.exports = {
    registerForm(req, res) {
        return res.render('user/register');
    },
    async post(req, res) {
        await User.create(req.body);
        const results = await User.findLastInsert();
        req.session.userId = results[0][0].id;
        return res.redirect('/user');
    },
    async show(req, res) {

        const { user } = req;

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('user/index', { user });
    },
    async put(req, res) {
        try {
            let { id, name, email, cpf_cnpj, cep, address } = req.body;

            cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
            cep = cep.replace(/\D/g, "");

            await User.update(
                {
                    id,
                    name,
                    email,
                    cpf_cnpj,
                    cep,
                    address
                }
            );

            return res.render('user/index', {
                user: req.body,
                success: "Dados de cadastro atualizados!"
            });

        } catch (error) {
            console.error(error);
            return res.render('user/index', {
                user: req.body,
                error: "Algo deu errado!"
            });
        }
    },
    delete(req, res) {

    }
}