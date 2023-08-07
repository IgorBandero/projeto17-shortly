import { customAlphabet } from "nanoid";
import { addOneVisit, deleteShortUrl, getRankingList, getShortUrl, getShortUrlsList, getUrl, getUrlsUser, newShortURL } from "../repositories/urlRepository.js";
import { checkUserToken } from "../repositories/authRepository.js";
import { registerUser } from "./userControllers.js";

// #############################################################################################

export async function shortenUrl(req, res){

    const { url } = req.body;
    const { authorization } = req.headers; 
    console.log(authorization);
    const token = authorization?.replace("Bearer", "");

    if (!token){
        return res.status(401).send("Acesso negado!");
    }

    try{
        const nanoid = customAlphabet("1234567890abcdef", 8);
        const shortUrl = nanoid();
        const user = await checkUserToken(token);
        if (user.rowCount === 0){
            return res.status(401).send("Usuário inválido!");
        }
        const promise = await newShortURL(url, shortUrl, user.rows[0].userId);
        res.status(201).send(promise.rows[0]);
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
            return res.status(404).send("URL não encontrada!");
        }
        const urlFound = {
                            id: promise.rows[0].id,
                            shortUrl: promise.rows[0].shortUrl,
                            url: promise.rows[0].url
                        }

        res.status(200).send(urlFound);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    } 
}

// #############################################################################################

export async function visitUrl(req, res){

    const { shortUrl } = req.params;

    try{
        const promise = await getShortUrl(shortUrl);
        if (promise.rowCount === 0){
            return res.status(404).send("URL não encontrada!");
        }        
        await addOneVisit(shortUrl);
        res.redirect(302, promise.rows[0].url);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    } 
}

// #############################################################################################

export async function deleteUrl(req, res){

    const { id } = req.params;
    const { authorization } = req.headers; 
    const token = authorization?.replace("Bearer ", "");

    if (!token){
        return res.status(401).send("Acesso negado!");
    }

    try{
        let userToken = await checkUserToken(token);        
        userToken = userToken.rows[0].userId;
        let userUrl = await getUrl(id);

        if (userUrl.rowCount === 0){
            return res.status(404).send("Url não cadastrada!");
        }

        userUrl = userUrl.rows[0].userId;

        if (userToken !== userUrl){
            return res.status(401).send("Url não pertence ao usuário logado no momento!");
        }

        await deleteShortUrl(id);
        res.status(204).send("URL apagada com sucesso!");
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    } 
}

// #############################################################################################

export async function getUserUrls(req, res){

    const { authorization } = req.headers; 
    const token = authorization?.replace("Bearer ", "");

    if (!token){
        return res.status(401).send("Acesso negado!");
    }

    try{
        let user = await checkUserToken(token);   

        if (user.rowCount === 0){
            return res.status(401).send("Usuário não autorizado!");
        }    

        user = user.rows[0];
        let userUrls = await getUrlsUser(user.userId)
        userUrls = userUrls.rows[0];

        let urls = getShortUrlsList(user.userId);
        urls = (await urls).rows;

        const userUrlsData = {...userUrls, shortenedUrls:[...urls]}

        res.status(200).send(userUrlsData);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    } 
}

// #############################################################################################

export async function getRanking(req, res){

    try{
        let ranking = await getRankingList();
        ranking = ranking.rows;
        res.status(200).send(ranking);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    } 
}