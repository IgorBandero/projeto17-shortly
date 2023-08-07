import { db } from "../database/database.js";
import { customAlphabet } from "nanoid";
import { getUrl, newShortURL } from "../repositories/urlRepository.js";
import { checkUserToken } from "../repositories/authRepository.js";

export async function shortenUrl(req, res){

    const { url } = req.body;
    const { authorization } = req.headers; 
    const token = authorization?.replace("Bearer ", "");

    if (!token){
        return res.status(401).send("Acesso negado!");
    }

    try{
        const nanoid = customAlphabet("1234567890abcdef", 8);
        const shortUrl = nanoid();
        const user = await checkUserToken(token);
        console.log(user.rows);
        const promise = await newShortURL(url, shortUrl, user.rows[0].userId);
        console.log(promise.rows);
        res.status(201).send(promise.rows);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    } 
}

// #############################################################################################

export async function getUrlById(req, res){

    const { id } = req.params;

    try{
        const promise = await getUrl(id);
        if (promise.rowCount === 0){
            return res.status(401).send("URL não encontrada!");
        }
        const urlFound = {
                        id: promise.rows[0].id,
                        shortUrl: promise.rows[0].shortURL,
                        url: promise.rows[0].url
                    }

        console.log(urlFound);
        res.status(200).send(urlFound);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    } 
}