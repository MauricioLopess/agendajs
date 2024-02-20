const Contato  = require('../models/ContatoModel.js');

exports.index = async (req, res) => {
  
  const contatos = new Contato();
  const contatosEncontrados = await contatos.buscaContatos();
  
  res.render('index', { contatos: contatosEncontrados });
  return;
};