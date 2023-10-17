import express from "express";
import { Request } from "express";
import conn from "../db_services/mysqlConnSetup";
import { UserData } from "../other_services/models/seqUsersData";
import bcrypt from "bcrypt";

const router = express.Router();
router.use(express.json());

router.post("/login", async (req, res) => {
    try {
        const result: any = await getUser(req.body.email, req.body.password);
        console.log("result", result)
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with user login");
    }
});

export async function getUser(email: string, password: string) {
    try {
        const user = await UserData.findOne({ where: { email: email } });
        // if (!user) {
        //     throw new Error("No user found with the given email");
        // } else if (!bcrypt.compareSync(password, user.password)) {
        //     throw new Error("Incorrect password");
        // } else {
            console.log(user);
            return user; // Remember to remove the password from the returned user object
        // }
    } catch (error) {
        throw error; // Re-throw the error so it can be caught in the router
    }
}

router.post("/signup", async (req, res) => {
    try {
        const result: any = await createUser(req.body.name_id, req.body.user_id, req.body.email, req.body.password);
        console.log("result", result)
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with fetching books");
    }
});

export async function createUser(name_id: number, user_id: number, email: string, password: string) {
    try {
        const user = await UserData.create({ name_id: name_id, user_id: user_id, email: email, pass: password });
        console.log(user.toJSON());
        return user.toJSON();
    } catch (error) {
        throw error; // Re-throw the error so it can be caught in the router
    }
}












//Fix any to user type
export async function loginUser(id: number) {
    const connection = await conn.getConnection();
    try{
        const [rows] = await connection.query(`SELECT * FROM users_data WHERE users_data_id = ?`, [id]);
        console.log("User fetched successfully: ", rows);
        connection.release();
        return rows;
    }catch(err){
        console.log("no user found with the given ID: ", err);
        connection.release();
    }
}

export default router;