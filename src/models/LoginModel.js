const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: {type: String, required: true },
  password: {type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body){
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login(){
    this.valida();
    if(this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email}); // recupera o usuário no banco de dados

    if(!this.user){
      this.errors.push('Usuário não existente');
      return; 
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)){ // compara se a senha do usuário é a mesma do formulário
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  async register(){
    this.valida();
    if(this.errors.length > 0) return;

    await this.userExists();
    if(this.errors.length > 0) return;

    // criando hash de senha
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);
    
    this.user = await LoginModel.create(this.body);
  }

  valida(){
    this.cleanUp();

    // Validação
    // valida email
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    // valida senha, de 3 a 50 caracteres
    if(this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('A senha precisa ter entre 3 a 50 caracteres');

  }

  // verifica se o usuário existe
  async userExists(){
    this.user = await LoginModel.findOne({ email: this.body.email});

    if(this.user) this.errors.push('Usuário já existente');
  }

  cleanUp(){
    for(let key in this.body){
      if(typeof this.body[key] !== 'string'){
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login;
