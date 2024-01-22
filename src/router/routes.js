require('dotenv').config();
const express = require('express');

const { getAll } = require('../controllers/categories');
const {
    postUser,
    login,
    updateUser,
    userDatails,
} = require('../controllers/userController');

const { 
    createProduct,
    editProduct, 
    listProduct, 
    detailProduct, 
    deleteProduct, 
} = require('../controllers/products');

const { 
    createCustomer, 
    listCustomers, 
    updateCustomer, 
    customerDatails 
} = require('../controllers/customers');

const { 
    registerOrder, 
    listOrders 
} = require('../controllers/requests');

const md = require('../middlewares/validateBody');
const authorization = require('../middlewares/verifyLogin');
const multer = require('../multer/multer');

const routes = express();

routes.get('/categoria', getAll);
routes.post('/usuario', md.validateBody, postUser);
routes.post('/login', login);


routes.use(authorization);

routes.get('/usuario', userDatails);
routes.put('/usuario',md.validateBody, updateUser);


routes.post('/produto', 
    multer.single("produto_imagem"),
    md.schemaValidateBodyProduct, 
    createProduct
);

routes.put('/produto/:id', 
    multer.single("produto_imagem"),
    md.schemaValidateBodyProduct, 
    editProduct
);

routes.get('/produto', listProduct);
routes.get('/produto/:id', detailProduct);
routes.delete("/produto/:id", deleteProduct);


routes.post("/cliente", md.schemaValidateBodyCustomer, createCustomer);
routes.put("/cliente/:id", md.schemaValidateBodyCustomer, updateCustomer)
routes.get("/cliente", listCustomers);
routes.get("/cliente/:id", customerDatails);


routes.post("/pedido",md.schemaValidateBodyOrder ,registerOrder);
routes.get("/pedido", listOrders);

module.exports = routes;
