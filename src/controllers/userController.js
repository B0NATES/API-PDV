const bcrypt = require('bcrypt');
const knex = require('../database/db_connection');
const jwt = require('jsonwebtoken');
const passwordHash = require('../../passwordHash');

const postUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(senha, 10);

    const emailExist = await knex('usuarios').where({ email }).first();
    if (emailExist) {
      return res.status(400).json('O email já existe');
    }
    
    const newUser = await knex('usuarios')
      .insert({ nome, email, senha: encryptedPassword })
      .returning(['id', 'nome', 'email']);

    if (!newUser[0]) {
      return res.status(400).json('O usuário não foi cadastrado');
    }

    return res.status(201).json(newUser[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json('Email e senha são obrigatórios');
  }

  try {
    const user = await knex('usuarios').where({ email }).first();

    if (!user) {
      return res.status(404).json('O usuário não foi encontrado');
    }

    const password = await bcrypt.compare(senha, user.senha);

    if (!password) {
      return res.status(400).json('E-mail e senha não conferem');
    }

    const token = jwt.sign({ id: user.id }, passwordHash, { expiresIn: '24h' });
    const { senha: _, ...userData } = user;

    return res.status(200).json({ user: userData, token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const userDatails = async (req, res) => {

    const user = req.user;
    if (!user) {
        return res.status(404).json("Usuário não encontrado");
    }
    
    try {

        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }

}

const updateUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  const userId = req.user.id;

  try {

    const emailExist = await knex('usuarios')
      .where({ email })
      .whereNot({ id: userId })
      .first();
    if (emailExist) {
      return res
        .status(400)
        .json('O email já está sendo utilizado por outro usuário');
    }

    let encryptedPassword = senha;
    if (senha) {
      encryptedPassword = await bcrypt.hash(senha, 10);
    }

    const updatedUser = await knex('usuarios')
      .where({ id: userId })
      .update({ nome, email, senha: encryptedPassword })
      .returning(['id', 'nome', 'email']);

    if (!updatedUser[0]) {
      return res.status(400).json('Não foi possível atualizar o usuário');
    }

    return res.status(200).json(updatedUser[0]);
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postUser,
  login,
  userDatails,
  updateUser,
};
