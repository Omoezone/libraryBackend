import express from "express";
import { Request } from "express";
import conn from "../db_services/mysqlConnSetup";
import bcrypt from "bcrypt";

const router = express.Router();
router.use(express.json());

router.post("/login", async (req, res) => {
    console.log(req.body);
    const result = await loginUser(2 /*req.body.id*/);
    res.status(200).send(result);
});

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