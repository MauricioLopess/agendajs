const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado');
    res.render('login');
    return;
}

exports.register = async (req, res) => {
    
    try {
        const login = new Login(req.body);
        await login.register();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'O usuário foi criado com sucesso!');
        req.session.save(() => {
            return res.redirect('/login/index');
        });


    } catch (error) {
        res.render('404');
    }
}

exports.login = async (req, res, next) => {
    try {
        const login = new Login(req.body);
        await login.login();

        if(login.errors.length > 0) {
            req.flash('errors', login.errors);
            req.session.save(() => {
                return res.redirect('/login/index');
            });
            return;
        }

        req.flash('success', 'Login realizado com sucesso!');
        req.session.user = login.user;
        req.session.save(() => {
            return res.redirect('/login/index');
        });


        // return res.send(login.errors);
    } catch (error) {
        res.render('404');
    }
}

exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/')
}