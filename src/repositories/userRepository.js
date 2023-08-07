import { db } from "../database/database.js";

export async function checkUserEmail(email){
    return await db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
}

export async function newUser(name, email, password){
    return await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, password]);
}