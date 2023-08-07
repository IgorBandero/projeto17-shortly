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

export async function getUrlsUser(userId){
    return db.query(`SELECT users.id, users.name, SUM(urls."visitCount") AS "visitCount" 
                     FROM users 
                     JOIN urls ON users.id = urls."userId"
                     WHERE users.id = $1
                     GROUP BY users.id, users.name;`, [userId]);
}

export async function getShortUrlsList(userId){
    return db.query(`SELECT urls.id, urls."shortUrl", urls.url, urls."visitCount" FROM urls WHERE "userId" = $1;`, [userId]);
}

export async function getRankingList(){
    return db.query(`SELECT users.id, users.name, COUNT(urls.id) AS "linksCount",  COALESCE(SUM(urls."visitCount"),0) AS "visitCount"
                     FROM users
                     LEFT JOIN urls ON users.id = urls."userId"
                     GROUP BY users.id, users.name
                     ORDER BY "visitCount" DESC NULLS LAST
                     LIMIT 10;`);
}