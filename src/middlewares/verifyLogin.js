const knex = require("../database/db_connection");
const passwordHash = require("../../src/passwordHash");
const jwt = require("jsonwebtoken");


const validateLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json("Não autorizado");
    }

    try {
        const token = authorization.replace("Bearer", "").trim();
        
        const { id } = jwt.verify(token, passwordHash);
        

        const userFound = await knex("usuarios").where({ id }).first();
        
        if (!userFound) {
            return res.status(404).json("Usuário não encontrado");
        }

        const { senha, ...user } = userFound;
        req.user = user


        next();

    } catch (error) {
        console.log(error.message)
        return res.status(400).json({message: error.message});

    }
}

module.exports = validateLogin;