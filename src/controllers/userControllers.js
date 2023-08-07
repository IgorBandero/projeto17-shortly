import { db } from "../database/database.js";
import { checkUserEmail, newUser } from "../repositories/userRepository.js";
import bcrypt from "bcrypt";

// #############################################################################################

export async function registerUser(req, res){
    
    const { name, email, password, confirmPassword } = req.body;  

    try{
        const user = await checkUserEmail(email);
        if (user.rows.length !== 0) {
            return res.status(409).send({ message: "Email já está cadastrado!"});
        }
        const cryptedPassword = bcrypt.hashSync(password, 10);
        await newUser(name, email, cryptedPassword);
        res.sendStatus(201);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    }
}

// #############################################################################################

export async function getUser(req, res){
        
    try{
        console.log("Deu certo!");
        res.sendStatus(201);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    } 
}