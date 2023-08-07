import { db } from "../database/database.js";

export async function newShortURL(url, shortUrl, userId){
    return db.query(`INSERT INTO urls (url, "shortUrl", "userId") 
    VALUES ($1, $2, $3) RETURNING id, "shortUrl";`, [url, shortUrl, userId]);
}

export async function getUrl(id){
    return db.query(`SELECT * FROM urls WHERE id=$1;`, [id]);
}

export async function getShortUrl(shortURL){
    return db.query(`SELECT * FROM urls WHERE "shortUrl"=$1;`, [shortURL]);
}

export async function addOneVisit(shortURL){
    return db.query(`UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl" = $1;`, [shortURL]);
}

export async function deleteShortUrl(id){
    return db.query("DELETE FROM urls WHERE id=$1;", [id]);
}