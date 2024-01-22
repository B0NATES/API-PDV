const { client } = require('../database/db_connection');
const knex = require('../database/db_connection');
const { uploadImage, deleteImageProduct } = require("../storage/storage");


const createProduct = async (req, res) => {
    const { file } = req;

    try {
        const {
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem
        } = req.body;


        if (file) {  

            const upload = await uploadImage(file);

            const product = await knex('produtos').insert({
                descricao,
                quantidade_estoque,
                valor,
                categoria_id,
                produto_imagem: upload.url
            }).returning('*');

            res.status(201).json(product[0])
        }

        
        const product = await knex('produtos').insert({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: null  
        }).returning('*');

        if (!product[0]) {
            return res.status(400).json('Não foi possível cadstrar o produto');
        }

        return res.status(201).json(product[0]);

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: error.message });
    }
}

async function editProduct(req, res) {
    const { id } = req.params;
    const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body;
    const { file } = req;

    try {

        if (file) { 

            const upload = await uploadImage(file);
            const imageFile = await knex("produtos")
            .where("id",
                id)
            .first("*");

        const tratar = await imageFile.produto_imagem.split(".com");
        const resultado = tratar[1];

        const lastPath = await resultado.split("%20").join(" ");

        await deleteImageProduct(lastPath);

        const updatedProduct = await knex('produtos')
        .where({ id })
        .update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
            produto_imagem: upload.url
        })
        .returning('*');
        
        return res.status(203).json(updatedProduct);

    }


    // verificação do id logo em seguida
    const existIngProduct = await knex('produtos').where({ id }).first();
    
    if (!existIngProduct) {
        return res.status(404).json({ message: 'Produto não encontrado' });
    }

    // faz o update e retorna o update feito
    const updatedProduct = await knex('produtos')
        .where({ id })
        .update({
            descricao,
            quantidade_estoque,
            valor,
            categoria_id,
        })
        .returning('*');

    
    return res.status(201).json(updatedProduct[0])
        
    } catch (error) {
        console.log(error.message);

        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function listProduct(req, res) {
    const { categoria_id } = req.query;
    
    try {
        let products;

        if (categoria_id) {
            const category = await knex("categorias")
                .where({ id: categoria_id })
                .first();
            if (!category) {
                return res.status(404).json("Categoria não encontrada");
            }

            products = await knex("produtos")
                .where({ categoria_id })
                .returning("*");

        } else {
            products = await knex("produtos").returning("*");
        }

        return res.status(200).json({ products });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
}

const detailProduct = async (req, res) => {

    const { id } = req.params;

    try {
        const product = await knex('produtos').where({
            id
        }).first();
        if (!product) {
            return res.status(404).json('Produto não encontrado');
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await knex("produtos")
            .where({
                id,
            })
            .returning("*");

        const verify = await knex("pedido_produtos")
            .where("produto_id", id)
            .first()

        if (verify) {
            return res.status(400).json({ message: "O produto está vinculado a um pedido e não pode ser excluído" });
        }

        if (!product) {
            return res.status(404).json("Produto não encontrado");
        }

        if (product.produto_imagem) {

            const tratar = await product.produto_imagem.split(".com");
            const resultado = tratar[1];
            const lastPath = await resultado.split("%20").join(" ");
            await deleteImageProduct(lastPath);
        }

        const deleteProduct = await knex("produtos").where({
            id,
        })
            .delete();

        if (!deleteProduct) {
            return res.status(400).json("Não foi possível excluir o produto");
        }

        return res.status(200).json("Produto excluído com sucesso");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

module.exports = {
    createProduct,
    editProduct,
    listProduct,
    detailProduct,
    deleteProduct
}

