import express from "express";
import { Request } from "express";
import conn from "../db_services/mysqlConnSetup";
import { UserData } from "../other_services/models/seqUsersData";
import bcrypt from "bcrypt";
import { QueryTypes } from "sequelize";
import sequelize from "../other_services/sequalizerConnection";


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

router.post("/auth/signup", async (req, res) => {
    try {
        console.log("result", req.body)
        const result: any = await createUser(req.body.first_name, req.body.last_name, req.body.email, req.body.password);
        console.log("result", result)
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong while creating user");
    }
});

export async function createUser(first_name: string, last_name:string, email: string, password: string) {
    try {
        let hash_password = bcrypt.hashSync(password, 10);
        const result = await sequelize.query('CALL create_user(?, ?, ?, ?)',
        {
          replacements: [first_name, last_name, email, hash_password],
          type: QueryTypes.RAW,
          model: UserData,
        });
        console.log(result)
        return result;
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