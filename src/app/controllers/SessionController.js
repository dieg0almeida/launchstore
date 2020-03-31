const crypto = require('crypto');
const User = require('../models/User');
const mailer = require('../../lib/mailer');
const { hash } = require('bcryptjs');

module.exports = {
    loginForm(req, res) {
        return res.render('session/login');
    },
    login(req, res) {
        req.session.userId = req.user.id;

        return res.redirect('/user');
    },
    logout(req, res) {
        req.session.destroy();
        return res.redirect('/');
    },
    forgotForm(req, res) {
        return res.render('session/forgot-password');
    },
    resetForm(req, res) {
        return res.render('session/password-reset', { token: req.query.token });
    },
    async forgot(req, res) {
        try {

            const token = crypto.randomBytes(20).toString('hex');

            let now = new Date();

            now = now.setHours(now.getHours() + 1);

            const user = req.user;

            user.reset_token = token;
            user.reset_token_expire = now;

            await User.updateToken(user);

            await mailer.sendMail({
                from: 'no-reply@launchstore.com',
                to: user.email,
                subject: 'Recuperação de Senha',
                html: `<h2>Esqueceu sua Senha?</h2>
            <p>Clique no link abaixo para recuperar a sua senha!</p>
            
            <p>
              <a href="http://localhost:3000/user/password-reset?token=${token}" target="_blank">
                RECUPERAR SENHA
              </a>
            </p>`
            });

            return res.render('session/forgot-password', {
                success: 'Um link de recuperação de senha foi enviado para o seu email!'
            });


        } catch (error) {
            console.error(error);
            return res.render('session/forgot-password', {
                error: 'Algo deu errado, tente novamente!'
            });
        }
    },
    async reset(req, res) {
        let { user } = req;

        const { password, token } = req.body;

        try {

            user.password = await hash(password, 8);
            user.reset_token = '';
            user.reset_token_expire = '';


            await User.updatePassword(user);

            return res.render('session/login', {
                success: "Senha atualizada!"
            })
        } catch (error) {
            console.error(error);
            return res.render('session/password-reset', {
                error: 'Algo deu errado, tente novamente!',
                user,
                token
            });
        }
    }
}
