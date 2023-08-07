import { db } from "../database/database.js";
import { newSession } from "../repositories/authRepository.js";
import { checkUserEmail, newUser } from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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

export async function loginUser(req, res){

    const { email, password } = req.body;
        
    try{
        const user = await checkUserEmail(email);
        if(user.rows.length === 0){
            return res.status(401).send({ message: "Usuário não localizado!" })
        }
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword){
            return res.status(401).send({ message: "Senha incorreta!" })
        }

        const token = uuid();
        await newSession(token, user.rows[0].id);

        res.status(200).send({ token });
    }
    catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    } 
}

