const knex = require("../database/db_connection");

const getAll = async (_req, res) => {
    
    try {
        const categories = await knex("categorias");
        return res.status(200).json(categories);

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAll
};