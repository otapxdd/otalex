-- Criação do Banco de Dados PostgreSQL para Otalex SaaS
-- Execute `CREATE DATABASE otalex_db;` e conecte-se a ele antes de rodar os scripts abaixo.

-- Definindo Tipos ENUM obrigatórios no PostgreSQL, caso sejam apagados no futuro pode usar DROP TYPE IF EXISTS
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_status AS ENUM ('ativo', 'inativo', 'banido');
CREATE TYPE license_status AS ENUM ('ativa', 'inativa', 'esgotada');
CREATE TYPE transaction_status AS ENUM ('pago', 'pendente', 'estornado', 'falhou');
CREATE TYPE project_status AS ENUM ('analise', 'aprovado', 'rejeitado');

-- 1. Tabela de Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) DEFAULT 'Gratuito', -- Ex: Pacote Nizi, PRO Mensal
    otacoins_balance INT DEFAULT 0,
    role user_role DEFAULT 'user',
    status user_status DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Função e Trigger nativos do Postgres para atualizar o 'updated_at' automaticamente
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime 
BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- 2. Tabela de License Keys
CREATE TABLE license_keys (
    id SERIAL PRIMARY KEY,
    license_key VARCHAR(50) UNIQUE NOT NULL, -- Ex: X9V2-L4KP-78W1
    plan_name VARCHAR(50) NOT NULL,
    credits_total INT NOT NULL DEFAULT 0,
    credits_used INT DEFAULT 0,
    is_unlimited BOOLEAN DEFAULT FALSE,
    status license_status DEFAULT 'ativa',
    user_id INT NULL, -- Pode ser NULL até a chave ser resgatada/comprada
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Tabela de Transações (Histórico de Compras e Vendas)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_code VARCHAR(50) UNIQUE NOT NULL, -- Ex: TRX-8291
    user_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status transaction_status DEFAULT 'pendente',
    payment_method VARCHAR(50), -- Ex: pix, stripe
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Tabela de Projetos Parallax (Galeria da Comunidade)
CREATE TABLE parallax_projects (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    anime_tag VARCHAR(50) NOT NULL,
    description TEXT,
    otalex_file_url VARCHAR(255) NOT NULL, -- Bucket AWS S3 / Cloud Storage
    likes INT DEFAULT 0,
    downloads INT DEFAULT 0,
    status project_status DEFAULT 'analise',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Tabela de Imagens de Preview (Layers dos Projetos Parallax)
CREATE TABLE parallax_images (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    layer_order INT NOT NULL, -- Determina ordem (1, 2, 3)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES parallax_projects(id) ON DELETE CASCADE
);

-- Inserir o primeiro Admin por padrão para garantir acesso inicial
INSERT INTO users (name, username, email, password_hash, role) 
VALUES ('Admin', 'admin_otalex', 'admin@otalex.com', '$2y$10$ExemploHashInseguroMasSeraTrocado', 'admin');
