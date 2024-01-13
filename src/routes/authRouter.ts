import express from "express";
import bcrypt from "bcrypt";
import sequelize from "../other_services/sequalizerConnection";
import { QueryTypes } from 'sequelize';
import { User, UserData, UserName } from "../other_services/models/seqModels";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const router = express.Router();
router.use(express.json());

router.post("/auth/login", async (req, res) => {
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
        let resultWithToken = {"authToken": jwt.sign({ user: jwtUser }, "secret"), "user": result};
        res.status(200).send(resultWithToken);
        return resultWithToken;
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with user login");
        return "Something went wrong with user login";
    }
});

router.post("/auth/signup", async (req, res) => {
    try {
        const result: any = await createUser(req.body.first_name, req.body.last_name, req.body.email, req.body.password);
        console.log("result: ", result)
        let jwtUser = {
            "users_data_id": result.users_data_id,
            "name_id": result.name_id,
            "user_id": result.user_id,
            "email": result.email,
            "pass": req.body.password,
            "snap_timestamp": result.snap_timestamp,
        }
        let resultWithToken = {"authToken": jwt.sign({ user: jwtUser }, "secret"), "user": result};
        res.status(200).send(resultWithToken);
        return resultWithToken;
    } catch (err:any) {
        if (err.code == 409){
            res.status(409).send(err.message);
            return err.message;
        } else {
            res.status(500).send("Something went wrong while creating user ");
            return "Something went wrong while creating user (returning 500)";
        }
    }
});

router.post("/neo4j/verify", async (req, res) => {
    try {
            
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send("Authorization token not provided");
        }

            jwt.verify(token, 'secret');
            
            res.status(200).json({message: "User is verified!!"});

    
    } catch (error) {
        console.log(error);
        res.status(401).send("Something went wrong with user login");
    }
});

export async function getUser(mail: string, password: string) {
    try {
        let user, userData;
        const user_id_data = await UserData.findOne({
            where: { email: mail },
            attributes: ["user_id"],
            include: [
                {
                model: User,
                attributes: ["is_deleted"],
                },
            ],
        });
        const userId = user_id_data?.get("user_id")
        const isDeleted = user_id_data?.User?.dataValues?.is_deleted;
        console.log("user_id: ", userId, isDeleted, user_id_data)
        if (isDeleted == false) {        
        user = await UserData.findAll({ 
            where: { user_id: userId },
            include: [
                {
                    model: UserName,
                    attributes: ["first_name", "last_name"],
                }
            ],
            order: [["snap_timestamp", "DESC"]], 
            limit: 1,
        }); 
        userData = user[0].get();
        userData.UserName = userData.UserName.dataValues;
        console.log("userData: ", userData)
        } else {
            console.log("User is deleted")
            throw new Error("User is deleted");
        }
        if (!user) {
            console.log("No user found with the given credentials")
            throw new Error("No user found with the given credentials");
        } else if (!bcrypt.compareSync(password, userData.pass)) {
            console.log("Incorrect email or password")
            throw new Error("Incorrect email or password");
        } else {
            return userData; // Remember to remove the password from the returned user object
        }
    } catch (error) {
        console.log("error: ", error)
        throw error; 
    }
}

export async function createUser(first_name: string, last_name:string, email: string, password: string) {
    try {
        const alreadyExists = await UserData.findOne({ where: { email: email } }); // Code 409
        if (alreadyExists) {
            throw {code: 409, message:"Email already exists"};
        }
        let hash_password = bcrypt.hashSync(password, 10);
        const result = await sequelize.query('CALL create_user(?, ?, ?, ?)',
        {
            replacements: [first_name, last_name, email, hash_password],
            type: QueryTypes.RAW,
            model: UserData,
        });
        console.log("created: ", result);
        let createdUser = getUser(email, password);
        console.log("createdUser: ", createdUser)
        return createdUser;
    } catch (error) {
        throw error;    
    }
}

export default router;