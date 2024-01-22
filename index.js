require("dotenv").config();
const express = require("express");
const joi = require('joi')
const app = express();
const cors = require("cors");
const route = require("./src/router/routes");

app.use(cors());
app.use(express.json());
app.use(route);


app.listen(process.env.PORT, ()=> {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});