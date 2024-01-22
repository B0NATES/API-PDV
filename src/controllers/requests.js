const knex = require("../database/db_connection");
const { send } = require("../functions/functions");

const registerOrder = async (req, res) => {
    const { cliente_id, pedido_produtos, observacao } = req.body;
    
    if (!cliente_id){
        return res.status(400).json({error: 'O campo cliente_id é obrigatório'})
    }
    
    try {
        const clienteExists = await knex('clientes').where('id', cliente_id).first();
        
        if (!clienteExists) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        const productId = pedido_produtos.map((pedidoProduto) => pedidoProduto.produto_id);


        const produtosNoEstoque = await knex('produtos')
        .whereIn('id', productId)
        .select('id', 'quantidade_estoque');

    if (productId.length !== produtosNoEstoque.length) {
        return res.status(404).json({ error: 'Um ou mais produtos não foram encontrados.' });
    }
        const findProduct = await knex('produtos')
            .whereIn('id', productId)
            .select('id', 'quantidade_estoque', 'valor');

            

        const insuficientProduct = findProduct.filter((produto) => {
            const pedidoProduto = pedido_produtos.find((pp) => pp.produto_id === produto.id);
            return produto.quantidade_estoque < pedidoProduto.quantidade_produto;
        });

        if (insuficientProduct.length > 0) {
            console.log('Produtos insuficientes:', insuficientProduct);
            return res.status(400).json({ error: 'Um ou mais produtos têm quantidade insuficiente em estoque.' });
        }

        const totalValue = pedido_produtos.reduce((total, pp) => {
            const product = findProduct.find((p) => p.id === pp.produto_id);
            return total + pp.quantidade_produto * product.valor;
        }, 0);

        const order = await knex('pedidos')
            .insert({
                cliente_id: cliente_id,
                observacao: observacao,
                valor_total: totalValue,
            })
            .returning('*');

        console.log(order && order.length > 0 ? order[0].id : null);

        await knex('pedido_produtos').insert(
            pedido_produtos.map((pp) => ({
                pedido_id: order[0].id,
                produto_id: pp.produto_id,
                quantidade_produto: pp.quantidade_produto,
                valor_produto: findProduct.find((p) => p.id === pp.produto_id).valor,
            }))
        );

        if (order && order.length > 0) {
            const clientMail = clienteExists.email;
            const subjects = 'Pedido cadastrado';
            send(clientMail, subjects);

            res.status(201).json(order[0]);
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
};


const listOrders = async (req, res) => {
    const { cliente_id } = req.query;
    try {
        let orders;
        if (cliente_id) {
            const client = await knex("clientes")
                .where({ id: cliente_id })
                .first();

            if (!client) {
                return res.status(404).json("Cliente não encontrado");
            }

            orders = await knex('pedidos')
                .where({ cliente_id })
                .returning('*');
        } else {
            orders = await knex('pedidos').returning('*');
        }
        return res.status(200).json({ orders });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    registerOrder,
    listOrders
}