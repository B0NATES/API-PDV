const { as } = require('../database/db_connection')
const functions = require('../functions/functions')

async function validateBody (req, res, next){
    try {
        
        await functions.schemaValidateBody.validateAsync(req.body)
        next()
    } catch (error) {
        console.log(error.message)
        
        return res.status(400).json({ error: error.message })
    }
}

async function schemaValidateBodyProduct (req, res, next){
    try {

        await functions.schemaValidateBodyProduct.validateAsync(req.body)
        next()
        
    } catch (error) {
        

        return res.status(400).json({error: error.message}) 
    }
}

async function schemaValidateBodyCustomer(req, res, next){
    try {
        await functions.schemaValidateBodyCustomer.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error.message);

        return res.status(400).json({error: error.message});
    }
}

async function schemaValidateBodyOrder (req, res, next){
    try {
        await functions.schemaValidateBodyOrder.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error.message);

        return res.status(400).json({error: error.message});
    }
}


module.exports = {
    validateBody,
    schemaValidateBodyProduct,
    schemaValidateBodyCustomer,
    schemaValidateBodyOrder,
}