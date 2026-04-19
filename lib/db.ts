import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function isDbConfigured() {
  return Boolean(
    process.env.MYSQL_HOST &&
      process.env.MYSQL_USER &&
      process.env.MYSQL_DATABASE
  );
}

export function getPool() {
  if (!isDbConfigured()) {
    throw new Error("Konfigurasi MySQL belum lengkap.");
  }

  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10
    });
  }

  return pool;
}

export async function query<T>(sql: string, params: unknown[] = []) {
  const [rows] = await getPool().query(sql, params);
  return rows as T[];
}
