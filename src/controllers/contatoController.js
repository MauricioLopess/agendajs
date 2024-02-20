const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('contato', { contato: { }});
}

exports.register = async (req, res) => {

    try {
        const contato = new Contato(req.body); 
        await contato.register();

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
               return res.redirect('/contato/index')
            });
            return;
        }

        req.flash('success', 'Seu contato foi registrado com sucesso!');
        req.session.save(() => {
            return res.redirect(`/contato/index/${contato.contato._id}`);
        });
        
    } catch (error) {
        console.log(error);
        res.render('404');
    }
    
}

exports.editIndex = async (req, res, next) => {
    if(!req.params.id) return res.render('404');
    
    const contato = new Contato(req.body);
    const contatoEncontrado = await contato.buscaPorId(req.params.id);
    if(!contatoEncontrado) return res.render('404');

    res.render('contato', {
        contato: contatoEncontrado
    });
}

exports.edit = async (req, res) => {
    try {
        if(!req.params.id) return res.render('404');
    
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
    
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
               return res.redirect('/contato/index')
            });
            return;
        }
    
        req.flash('success', 'Seu contato foi alterado com sucesso!');
        req.session.save(() => {
            return res.redirect(`/contato/index/${contato.contato._id}`);
        });
    } catch (error) {
        console.log(error);
        return res.render('404');
    }
}

exports.delete = async (req, res, next) => {
    if(!req.params.id) return res.render('404');
    
    const contato = new Contato(req.body);
    const contatoEncontrado = await contato.deleteContato(req.params.id);
    if(!contatoEncontrado) return res.render('404');

    req.flash('success', 'Seu contato foi apagado com sucesso!');
    req.session.save(() => {
        return res.redirect(`back`);
    });
}
