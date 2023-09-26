import express from "express";
import { Request } from "express";
import conn from "../db_services/mysqlConnSetup";

const router = express.Router();
router.use(express.json());
//TODO fix any
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

export default router;