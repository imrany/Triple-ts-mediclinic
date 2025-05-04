import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
//   ssl: true,
});

const queries = [
  `CREATE TABLE IF NOT EXISTS users (
    user_reference TEXT NOT NULL PRIMARY KEY, 
    photo TEXT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    location_name TEXT,
    location_lat_long TEXT,
    type VARCHAR(10) DEFAULT 'user' not null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(10) DEFAULT 'active' not null,
    agreed_to_terms_and_conditions BOOLEAN NOT NULL DEFAULT TRUE,
    email_marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
    whatsapp_consent BOOLEAN NOT NULL DEFAULT FALSE,
    whatsapp_number TEXT
)`,
  `CREATE INDEX IF NOT EXISTS user_idx on users (user_reference)`,

  `CREATE TABLE IF NOT EXISTS notifications (
    notification_reference TEXT NOT NULL PRIMARY KEY, 
    body TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    title TEXT NOT NULL,
    icon TEXT,
    sent_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    opened_on TIMESTAMP
)`,
  `CREATE INDEX IF NOT EXISTS notifications_idx ON notifications (notification_reference)`,

  `CREATE TABLE IF NOT EXISTS businesses ( 
    business_reference TEXT NOT NULL PRIMARY KEY, 
    business_name TEXT NOT NULL UNIQUE, 
    business_logo TEXT, 
    business_email TEXT NOT NULL UNIQUE,
    business_owner TEXT NOT NULL UNIQUE,
    location_name TEXT NOT NULL,
    location_photo TEXT,
    location_lat_long TEXT,
    business_description TEXT NOT NULL,
    till_number INTEGER,
    paybill INTEGER,
    paybill_account_number TEXT,
    phone_number TEXT NOT NULL UNIQUE,
    reviews INTEGER,
    created_at TIMESTAMP NOT NULL, 
    views INTEGER,
    status  VARCHAR(10) DEFAULT 'active' not null,
    paid INTEGER NOT NULL DEFAULT 0
)`,
  `CREATE INDEX IF NOT EXISTS businesses_idx ON businesses (business_reference)`,

  `CREATE TABLE IF NOT EXISTS products (
    product_reference TEXT NOT NULL PRIMARY KEY, 
    product_photo JSONB DEFAULT '[""]',
    product_category TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_description TEXT NOT NULL,
    product_price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0,
    business_email TEXT NOT NULL,
    discount_code TEXT,
    discount INTEGER DEFAULT 0,
    availability TEXT DEFAULT 'available',
    updated_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    colours TEXT,
    sizes TEXT,
    store_ref TEXT NOT NULL,
    original_price INTEGER 
)`,
  `CREATE INDEX IF NOT EXISTS products_idx ON products (product_reference)`,

  `CREATE TABLE IF NOT EXISTS adverts (
    advert_reference TEXT NOT NULL PRIMARY KEY, 
    media TEXT NOT NULL,
    link TEXT NOT NULL DEFAULT '/' ,
    type TEXT DEFAULT 'in-app',
    business_email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_type TEXT
)`,
  `CREATE INDEX IF NOT EXISTS adverts_idx ON adverts (advert_reference)`,

  `CREATE TABLE IF NOT EXISTS orders (
    order_reference TEXT NOT NULL PRIMARY KEY, 
    product_reference TEXT NOT NULL,
    carrier_option TEXT NOT NULL,
    payment_method TEXT DEFAULT 'M-Pesa',
    total_price INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status TEXT DEFAULT 'Unpaid' NOT NULL,
    email TEXT NOT NULL,
    discount_code TEXT,
    full_name TEXT NOT NULL,
    location_lat_long TEXT DEFAULT 0,
    city TEXT NOT NULL,
    postal_code TEXT,
    street_address TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    discount INTEGER DEFAULT 0,
    type TEXT DEFAULT 'guest',
    business_email TEXT NOT NULL,
    refund_amount INTEGER DEFAULT 0,
    colors TEXT,
    sizes TEXT,
    seller_total_earned_per_order INTEGER NOT NULL,
    commission_earned INTEGER NOT NULL
)`,
  `CREATE INDEX IF NOT EXISTS orders_idx ON orders (order_reference)`,

  `CREATE TABLE IF NOT EXISTS transactions (
    external_reference TEXT NOT NULL PRIMARY KEY, 
    mpesa_receipt_number TEXT NOT NULL,
    checkout_request_id TEXT NOT NULL,
    merchant_request_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    phone_number TEXT NOT NULL,
    result_code TEXT,
    result_description TEXT,
    status TEXT
)`,
  `CREATE INDEX IF NOT EXISTS transactions_idx ON transactions (external_reference)`,
  `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO villebiz;`,
];

(async () => {
  for (const query of queries) {
    try {
      await pool.query(query);
      console.log("Query executed successfully:", query);
    } catch (error) {
      console.error("Error executing query:", query, error);
    }
  }
})();