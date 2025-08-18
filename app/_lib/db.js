import pkg from 'pg'
const { Pool } = pkg

export const pool = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'mydb',
    password: process.env.PGPASSWORD || '',
    port: process.env.PGPORT || 5432,
})
