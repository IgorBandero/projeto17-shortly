import { db } from "../database/database.js";

export async function newSession(token, userId){
    return await db.query(`INSERT INTO "authSessions" (token, "userId") VALUES ($1, $2);`, [token, userId]);
}

export async function checkUserToken(token){
    return await db.query(`SELECT * FROM "authSessions" WHERE token=$1;`, [token]);
}