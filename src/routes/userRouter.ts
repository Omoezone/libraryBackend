import express from "express";
import { Request } from "express";
import conn from "../db_services/mysqlConnSetup";
import bcrypt from "bcrypt";

const router = express.Router();
router.use(express.json());
//TODO fix any to user type
router.get("/user/:id", async (req: Request<{ id: number}>, res) => {
    try {
        const result: any = await getUserById(req.params.id);
        if (result.length == 0) {
            res.status(404).send("No user found with the given id");
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with fetching user");
    }
});

export async function getUserById(id: number) {
    const connection = await conn.getConnection();
    try{
        const [rows] = await connection.query(`CALL get_user_information(?)`, [id]);
        console.log("User fetched successfully: ", rows);
        connection.release();
        return rows;
    }catch(err){
        console.log("no user found with the given ID: ", err);
        connection.release();
    }
}

// create user and user_data related to that user 
// TODO fix any to user type
router.post("/user",  async (req, res) => {
    try{
        const result = await createUser(req.body);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
});

export async function createUser(values: any) {
    values.password = await bcrypt.hash(values.password, 10);
    const connection = await conn.getConnection();
    try {
        await connection.query(`CALL create_user(?,?,?,?)`, [values.firstName, values.lastName, values.email, values.password]);
        connection.release();
        return "customer added";
    }catch(err){
        console.log(err)
        connection.release();
    }
}

// update user data
// TODO look into params to be number
router.post("/user/:id", async (req, res) => {
    try{
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const result = await updateUser(req.params.id, req.body);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
});

export async function updateUser(id: string, values: any) {
    const connection = await conn.getConnection();
    try {
        await connection.query(`CALL update_user(?,?,?,?,?,?)`, [values.nameId, values.firstName, values.lastName, id, values.email, values.password]);
        connection.release();
        return "customer updated";
    }catch(err){
        console.log(err)
        connection.release();
    }
}

export default router;