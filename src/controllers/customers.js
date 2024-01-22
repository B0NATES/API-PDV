const knex = require("../database/db_connection");

const createCustomer =  async (req, res) => {
    const {
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado
    } = req.body;

    try {

        const emailExist = await knex('clientes').where({ email }).first();
        if (emailExist) {
            return res.status(400).json('O email já está sendo usado por outro cliente');
        }

        const cpfExist = await knex('clientes').where({ cpf }).first();
        if (cpfExist) {
            return res.status(400).json('O cpf já está sendo usado por outro cliente');
        }

        const customer = await knex("clientes").insert({
            nome,
            email,
            cpf,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado
        }).returning("*");

        if (!customer[0]) {
            return res.status(400).json("Não foi possível cadastrar o cliente");
        }

        return res.status(201).json(customer[0]);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updateCustomer = async (req, res) => {
    const {
        nome,
        email,
        cpf,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        estado
    } = req.body;

    const { id } = req.params;

    try {
        const customer = await knex("clientes").where({ id }).first();
        if (!customer) {
            return res.status(404).json("Cliente não encontrado");
        }
        
        const emailExist = await knex('clientes').where({ email }).first();
        
        if (emailExist && emailExist.id != id) {
            return res.status(400).json('O email já está sendo usado por outro cliente');
        }

        const cpfExist = await knex('clientes').where({ cpf }).first();
        if (cpfExist && cpfExist.id != id) {
            return res.status(400).json('O cpf já está sendo usado por outro cliente');
        }

        const updateCustomer = await knex("clientes")
        .update({
            nome,
            email,
            cpf,
            cep,
            rua,
            numero,
            bairro,
            cidade,
            estado
        })
        .where({id})
        .returning('*');

        if (!updateCustomer) {
            return res.status(400).json("Não foi possível atualizar as informações do cliente");
        }

        return res.status(200).json(updateCustomer[0]);
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: error.message});
    }
}

const listCustomers = async (_req, res) => {
    try {
        const allCustomers = await knex("clientes");
        return res.status(200).json(allCustomers);
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

const customerDatails = async (req, res) => {
    const { id } = req.params;

    try {
        const customer = await knex("clientes").where({ id }).first();
        if (!customer) {
            return res.status(404).json("Cliente não encontrado")
        }

        return res.status(200).json(customer);

    } catch (error) {
        
        return res.status(400).json({message: error.message});
    }
}

module.exports = {
    createCustomer,
    updateCustomer,
    listCustomers,
    customerDatails
}