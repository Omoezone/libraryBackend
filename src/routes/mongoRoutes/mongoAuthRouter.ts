import express from 'express';
import logger from '../../other_services/winstonLogger';
import UserData from '../../other_services/mongoSchemas/userDataSchema'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post("/mongo/auth/login", async (req, res) => {
    try {
        const result: any = await getUser(req.body.email, req.body.password);

        let jwtUser = {
            "users_data_id": result.users_data_id,
            "name_id": result.name_id,
            "user_id": result.user_id,
            "email": result.email,
            "pass": req.body.password,
            "snap_timestamp": result.snap_timestamp,
        }
        let resultWithToken = {"authToken": jwt.sign({ user: jwtUser}, "secret"), "user": result};

        res.status(200).send(resultWithToken);
    } catch (error) {
        console.log(error);
        res.status(401).send("Something went wrong with user login");
    }
});

router.post("/mongo/auth/signup", async (req, res) => {
    try{
        const result: any = await createUser(req.body.first_name, req.body.last_name, req.body.email, req.body.password);
        let jwtUser = {
            "users_data_id": result.users_data_id,
            "name_id": result.name_id,
            "user_id": result.user_id,
            "email": result.email,
            "pass": req.body.password,
            "snap_timestamp": result.snap_timestamp,
        }
        let resultWithToken = {"authToken": jwt.sign({ user: jwtUser}, "secret"), "user": result};
        res.status(200).json(resultWithToken);

    }catch(error: any){
        console.log(error);
        if(error.code == 409){
            res.status(409).send(error.message);
        }else{
            res.status(500).send("Something went wrong with user signup");
        }
        console.log(error);
    }
});


router.post("/mongo/auth/verify", async (req, res) => {
    try {
        
        let decodedUser: any = jwt.verify(req.body.authToken, "secret");
        const result: any = await getUser(decodedUser.userMail, decodedUser.userPassword);

        if(!result){
            throw new Error("User not found");
        }
        
        res.status(200).send(result);
    
    } catch (error) {
        console.log(error);
        res.status(401).send("Something went wrong with user login");
    }
});


async function getUser(email: string, password: string){
    try{
        const user = await UserData.findOne({'user_data.email': email});
        if(!user){
            throw new Error("No user found with the given email");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.user_data[0].password);
        console.log("Gets here to password check")
        
        console.log("Password: " + user.user_data[0].password);

        if(!isPasswordCorrect){
            throw new Error("Incorrect password");
        }
        const jwtToken = jwt.sign({'userID: ': user._id, 'userName': user.user_data[0].first_name, 'userLastname': user.user_data[0].last_name, 'userMail': user.user_data[0].email}, 'secret');
        
        return jwtToken;

    }catch(error){
        logger.error("Something went wrong with getting user logged in")
        throw error;
    }
}

async function createUser(first_name: string, last_name: string, email: string, password: string){
    try{
        const hash = await bcrypt.hash(password, 10);
        if(await UserData.exists({'user_data.email': email})){
            throw new Error("Email already exists");
        }
        try{
            const user = await UserData.create({user_data: {first_name: first_name, last_name: last_name, email: email, password: hash}});
            return user;
        }catch(error){
            logger.error("Something went wrong with hashing password")
            throw error;
        }
    }catch(error){
        logger.error("Something went wrong with creating user")
        throw error;
    }
}


export default router;