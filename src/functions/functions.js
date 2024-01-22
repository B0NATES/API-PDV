const joi = require('joi');
const transport = require ('../services/mail')
const fs = require('fs/promises')

const schemaValidateBody = joi.object({
    nome: joi.string().required().messages({
        "any.required": "O campo nome é obrigatório.",
        "string.empty": "O campo nome não pode ser vazio."
    }),
    email: joi.string().email().required().messages({
        "any.required": "O campo email é obrigatório.",
        "string.empty": "O campo email não pode ser vazio.",
        "string.email": "O campo email deve ser um email válido."
    }),
    senha: joi.string().required().messages({
        "any.required": "O campo senha é obrigatório.",
        "string.empty": "O campo senha não pode ser vazio.",
    })

})

const schemaValidateBodyProduct = joi.object({
    descricao: joi.string().required().messages({
        "any.required": "O campo descricao é obrigatório.",
        "string.empty": "O campo descricao não pode ser vazio."
    }),
    quantidade_estoque: joi.alternatives().try(
        joi.number().integer().min(0).required().messages({
            "any.required": "O campo quantidade_estoque é obrigatório.",
            "number.base": "O campo quantidade_estoque deve ser um número inteiro.",
            "number.min": "O campo quantidade_estoque não pode ser negativo."
        }),
        joi.string().required().messages({
            "any.required": "O campo quantidade_estoque é obrigatório.",
            "string.empty": "O campo quantidade_estoque não pode ser vazio."
        })
    ).allow(null).messages({
        "any.only": "O campo quantidade_estoque não pode ser nulo."
    }),
    valor: joi.alternatives().try(
        joi.number().min(1).required().messages({
            "any.required": "O campo valor é obrigatório.",
            "number.base": "O campo valor deve ser um número.",
            "number.min": "O campo valor não pode ser negativo."
        }),
        joi.string().required().messages({
            "any.required": "O campo valor é obrigatório.",
            "string.empty": "O campo valor não pode ser vazio."
        })
    ).allow(null).messages({
        "any.only": "O campo valor não pode ser nulo."
    }),
    categoria_id: joi.number().integer().min(1).max(9).required().messages({
        "any.required": "O campo categoria_id é obrigatório.",
        "number.base": "O campo categoria_id deve ser um número inteiro.",
        "number.min": "O campo categoria_id deve ser no mínimo 1.",
        "number.max": "O campo categoria_id deve ser no máximo 9."
    }),
}).options({ presence: 'required' });


const schemaValidateBodyCustomer = joi.object({
    nome: joi.string().required().messages({
        "any.required": "O campo nome é obrigatório.",
        "string.empty": "O campo nome não pode ser vazio."
    }),
    email: joi.string().email().required().messages({
        "any.required": "O campo email é obrigatório.",
        "string.empty": "O campo email não pode ser vazio.",
        "string.email": "O campo email deve ser um email válido."
    }),
    cpf: joi.string().required().messages({
        "any.required": "O campo cpf é obrigatório.",
        "string.empty": "O campo cpf não pode ser vazio."
    }),
    cep: joi.string(),
    rua: joi.string(),
    numero: joi.number().integer(),
    bairro: joi.string(),
    cidade: joi.string(),
    estado: joi.string()
});


const schemaValidateBodyOrder = joi.object({
    cliente_id: joi.alternatives().try(
        joi.number().integer().min(0).required().messages({
            "any.required": "O campo cliente_id é obrigatório.",
            "number.base": "O campo cliente_id deve ser um número inteiro.",
            "number.min": "O campo cliente_id não pode ser negativo."
        }),
        joi.string().required().messages({
            "any.required": "O campo cliente_id é obrigatório.",
            "string.empty": "O campo cliente_id não pode ser vazio."
        })
    ).allow(null).messages({
        "any.only": "O campo cliente_id não pode ser nulo."
    }),

    observacao: joi.string().allow('').optional().messages({
        "string.empty": "O campo observacao não pode ser vazio.",
    }),

    pedido_produtos: joi.array().min(1).items(joi.object({
        produto_id: joi.number().integer().min(1).required().messages({
            "any.required": "O campo produto_id é obrigatório.",
            "number.base": "O campo produto_id deve ser um número inteiro.",
            "number.min": "O campo produto_id não pode ser negativo."
        }),

        quantidade_produto: joi.number().integer().min(1).required().messages({
            "any.required": "O campo quantidade_produto é obrigatório.",
            "number.base": "O campo quantidade_produto deve ser um número inteiro.",
            "number.min": "O campo quantidade_produto não pode ser negativo."
        }),
    })).required().messages({
        "array.min": "Pelo menos um produto deve ser especificado no pedido."
    }),
});

async function send (to, subject, body) {
    const template = await fs.readFile('./src/templates/order.html')
    transport.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html: template.toString()
    })
}

module.exports = {
    schemaValidateBody,
    schemaValidateBodyProduct,
    schemaValidateBodyCustomer,
    schemaValidateBodyOrder,
    send,
}