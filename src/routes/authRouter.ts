import express from "express";
import bcrypt from "bcrypt";
import sequelize from "../other_services/sequalizerConnection";
import { QueryTypes } from 'sequelize';
import { UserData, UserName } from "../other_services/models/seqModels";
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
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with user login");
    }
});

router.post("/auth/signup", async (req, res) => {
    try {
        const result: any = await createUser(req.body.first_name, req.body.last_name, req.body.email, req.body.password);
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
    } catch (err:any) {
        if (err.code == 409){
            res.status(409).send(err.message);
        } else {
            res.status(500).send("Something went wrong while creating user");
        }
        console.log(err);
    }
});

router.post("/auth/verify", async (req, res) => {
    try {
        let decodedUser: any = jwt.verify(req.body.authToken, "secret");
        const result: any = await getUser(decodedUser.user.email, decodedUser.user.pass);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with user login");
    }
});

export async function getUser(mail: string, password: string) {
    try {
        const user_id = await UserData.findOne({ where: { email: mail }, attributes: ["user_id"]});
        let userId = user_id?.get("user_id")
        let user = await UserData.findAll({ 
            where: { user_id: userId, is_deleted: 0 },
            include: [
                {
                    model: UserName,
                    attributes: ["first_name", "last_name"],
                }
            ],
            order: [["snap_timestamp", "DESC"]], 
            limit: 1,
        }); 
        let userData = user[0].get();
        userData.UserName = userData.UserName.dataValues;
        if (!user) {
            throw new Error("No user found with the given credentials");
        } else if (!bcrypt.compareSync(password, userData.pass)) {
            throw new Error("Incorrect email or password");
        } else {
            return userData; // Remember to remove the password from the returned user object
        }
    } catch (error) {
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
        let createdUser = getUser(email, password);
        return createdUser;
    } catch (error) {
        throw error; // Re-throw the error so it can be caught in the router
    }
}

export default router;