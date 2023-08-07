import { db } from "../database/database.js";

export async function newShortURL(url, shortUrl, userId){
    return db.query(`INSERT INTO urls (url, "shortURL", "userId") 
    VALUES ($1, $2, $3) RETURNING id, "shortURL";`, [url, shortUrl, userId]);
}

export async function getUrl(id){
    return db.query(`SELECT * FROM urls WHERE id=$1;`, [id]);
}