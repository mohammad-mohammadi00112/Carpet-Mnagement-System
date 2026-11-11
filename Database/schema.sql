-- Carpet Management System
-- PostgreSQL schema generated from the user's XMind design.
-- Run this file first.

BEGIN;

CREATE TYPE movement_type_enum AS ENUM
('purchase','sale','sale_return','transfer_in','transfer_out','adjustment');
CREATE TYPE purchase_payment_status_enum AS ENUM ('unpaid','partial','paid');
CREATE TYPE record_status_enum AS ENUM ('active','cancelled');
CREATE TYPE payment_method_enum AS ENUM ('cash','card','bank_transfer','check');
CREATE TYPE employee_status_enum AS ENUM ('hired','fired');
CREATE TYPE sale_payment_status_enum AS ENUM ('unpaid','partial','paid');
CREATE TYPE payment_type_enum AS ENUM ('deposit','installment','full_payment','refund');
CREATE TYPE customer_type_enum AS ENUM ('retail','wholesale');
CREATE TYPE location_type_enum AS ENUM ('showroom','warehouse','shelf','other');
CREATE TYPE carpet_type_enum AS ENUM ('handmade','machine_made');
CREATE TYPE carpet_condition_enum AS ENUM ('new','used','damaged','restored');
CREATE TYPE audit_action_enum AS ENUM ('insert','update','delete');

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10),
    is_base BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200),
    phone VARCHAR(50),
    email VARCHAR(200),
    national_id VARCHAR(50),
    emergency_phone VARCHAR(50),
    home_address VARCHAR(200),
    job_title VARCHAR(300),
    salary NUMERIC(12,2),
    hire_date DATE,
    status employee_status_enum DEFAULT 'hired',
    shift_start TIME,
    shift_end TIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200),
    company_name VARCHAR(300),
    phone VARCHAR(50),
    email VARCHAR(200),
    address VARCHAR(300),
    description TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200),
    phone VARCHAR(50),
    email VARCHAR(200),
    address VARCHAR(300),
    customer_type customer_type_enum DEFAULT 'retail',
    credit_limit NUMERIC(12,2) DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    type location_type_enum NOT NULL,
    address VARCHAR(200),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE carpet_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE expense_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_id INT UNIQUE REFERENCES employees(id),
    role_id INT REFERENCES roles(id),
    username VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    image TEXT,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE shop_settings (
    id SERIAL PRIMARY KEY,
    shop_name VARCHAR(200),
    logo TEXT,
    phone VARCHAR(50),
    address VARCHAR(300),
    invoice_prefix VARCHAR(20),
    invoice_footer TEXT,
    tax_rate NUMERIC(5,2) DEFAULT 0,
    base_currency_id INT REFERENCES currencies(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE exchange_rates (
    id SERIAL PRIMARY KEY,
    currency_id INT REFERENCES currencies(id),
    rate_to_base NUMERIC(18,6) NOT NULL,
    rate_date DATE NOT NULL,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carpets (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    name VARCHAR(200) NOT NULL,
    category_id INT REFERENCES carpet_categories(id),
    country_of_origin VARCHAR(300),
    width_cm NUMERIC(8,2),
    length_cm NUMERIC(8,2),
    material VARCHAR(300),
    type carpet_type_enum,
    weight_kg NUMERIC(8,2),
    color VARCHAR(300),
    design VARCHAR(300),
    condition carpet_condition_enum,
    currency_id INT REFERENCES currencies(id),
    purchase_price NUMERIC(12,2),
    sale_price NUMERIC(12,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id),
    employee_id INT REFERENCES employees(id),
    purchase_date DATE NOT NULL,
    purchase_place VARCHAR(200),
    currency_id INT REFERENCES currencies(id),
    exchange_rate NUMERIC(18,6),
    total_amount NUMERIC(12,2) DEFAULT 0,
    payment_status purchase_payment_status_enum DEFAULT 'unpaid',
    status record_status_enum DEFAULT 'active',
    notes TEXT,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE purchase_details (
    id SERIAL PRIMARY KEY,
    purchase_id INT REFERENCES purchases(id) ON DELETE CASCADE,
    carpet_id INT REFERENCES carpets(id),
    location_id INT REFERENCES locations(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    purchase_price NUMERIC(12,2) NOT NULL
);

CREATE TABLE purchase_payments (
    id SERIAL PRIMARY KEY,
    purchase_id INT REFERENCES purchases(id) ON DELETE CASCADE,
    payment_date TIMESTAMP NOT NULL,
    payment_method payment_method_enum NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency_id INT REFERENCES currencies(id),
    exchange_rate NUMERIC(18,6),
    notes TEXT,
    created_by INT REFERENCES users(id)
);

CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    employee_id INT REFERENCES employees(id),
    sale_date TIMESTAMP NOT NULL,
    currency_id INT REFERENCES currencies(id),
    exchange_rate NUMERIC(18,6),
    discount NUMERIC(12,2) DEFAULT 0,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    payment_status sale_payment_status_enum DEFAULT 'unpaid',
    status record_status_enum DEFAULT 'active',
    due_date DATE,
    notes TEXT,
    created_by INT REFERENCES users(id),
    updated_at TIMESTAMP
);

CREATE TABLE sales_details (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(id) ON DELETE CASCADE,
    carpet_id INT REFERENCES carpets(id),
    location_id INT REFERENCES locations(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    sale_price NUMERIC(12,2) NOT NULL,
    discount NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(id),
    received_by INT REFERENCES employees(id),
    payment_date TIMESTAMP NOT NULL,
    payment_method payment_method_enum NOT NULL,
    payment_type payment_type_enum NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency_id INT REFERENCES currencies(id),
    exchange_rate_to_sale NUMERIC(18,6),
    amount_in_sale_currency NUMERIC(12,2)
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    sale_id INT UNIQUE REFERENCES sales(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date TIMESTAMP NOT NULL,
    currency_id INT REFERENCES currencies(id),
    tax_amount NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL
);

CREATE TABLE sale_returns (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(id),
    return_date TIMESTAMP NOT NULL,
    reason TEXT,
    refund_amount NUMERIC(12,2) DEFAULT 0,
    processed_by INT REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sale_return_details (
    id SERIAL PRIMARY KEY,
    return_id INT REFERENCES sale_returns(id) ON DELETE CASCADE,
    sales_detail_id INT REFERENCES sales_details(id),
    location_id INT REFERENCES locations(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    refund_price NUMERIC(12,2) NOT NULL
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES expense_categories(id),
    expense_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency_id INT REFERENCES currencies(id),
    exchange_rate NUMERIC(18,6),
    description TEXT,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carpet_images (
    id SERIAL PRIMARY KEY,
    carpet_id INT REFERENCES carpets(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    carpet_id INT REFERENCES carpets(id),
    location_id INT REFERENCES locations(id),
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (carpet_id, location_id)
);

CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    carpet_id INT REFERENCES carpets(id),
    location_id INT REFERENCES locations(id),
    movement_type movement_type_enum NOT NULL,
    quantity_change INT NOT NULL,
    purchase_detail_id INT REFERENCES purchase_details(id),
    sale_detail_id INT REFERENCES sales_details(id),
    sale_return_detail_id INT REFERENCES sale_return_details(id),
    note TEXT,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action audit_action_enum NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
