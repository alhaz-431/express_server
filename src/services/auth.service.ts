import { pool } from "../models/db";
import bcrypt from "bcrypt";

export const createUser = async (name: string, email: string, password: string, phone: string, role: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email.toLowerCase()]);
  return result.rows[0];
};
