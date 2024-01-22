-- DROP TABLE IF EXISTS usuarios;
-- DROP TABLE IF EXISTS categorias;

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    descricao TEXT
);

INSERT INTO categorias (descricao)
VALUES
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    descricao TEXT,
    quantidade_estoque INTEGER,
    valor INTEGER,
    categoria_id INTEGER REFERENCES categorias (id)
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    cpf CHAR(11) UNIQUE,
    cep CHAR(8),
    rua TEXT,
    numero INTEGER,
    bairro TEXT,
    cidade TEXT,
    estado TEXT
);

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes (id),
    observacao TEXT,
    valor_total INTEGER
);

CREATE TABLE IF NOT EXISTS pedido_produtos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos (id),
    produto_id INTEGER REFERENCES produtos (id),
    quantidade_produto INTEGER,
    valor_produto INTEGER
);

ALTER TABLE produtos ADD COLUMN produto_imagem TEXT;
