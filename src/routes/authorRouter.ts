import express from 'express';
import { Request } from 'express';
import conn from '../db_services/mysqlConnSetup';

const router = express.Router();
router.use(express.json());

// Get all authors
router.get("/authors", async (req, res) => {
    try {
        const result: any = await getAllAuthors();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with fetching authors");
    }
});

export async function getAllAuthors() {
    const connection = await conn.getConnection();
    try{
        const [rows] = await connection.query(`SELECT * FROM authors`);
        console.log("Authors fetched successfully: ", rows);
        connection.release();
        return rows;
    }catch(err){
        console.log("no authors found: ", err);
        connection.release();
    }
}

// Get author by id
router.get("/author/:id", async (req: Request<{ id: number}>, res) => {
    try {
        const result: any = await getAuthorById(req.params.id);
        if (result.length == 0) {
            res.status(404).send("No author found with the given id");
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with fetching author");
    }
});

export async function getAuthorById(id: number) {
    const connection = await conn.getConnection();
    try{
        const [rows] = await connection.query(`SELECT * FROM authors a where a.author_id = ?`, [id]);
        console.log("Author fetched successfully: ", rows);
        connection.release();
        return rows;
    }catch(err){
        console.log("no author found with the given ID: ", err);
        connection.release();
    }
}
// create author
// TODO look into making total_books set automatically prop with trigegrs
router.post("/author",  async (req, res) => {
    try{
        const result = await createAuthor(req.body);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
});

export async function createAuthor(values: any) {
    const connection = await conn.getConnection();
    try {
        await connection.query(`INSERT INTO authors (username, total_books) VALUES (?,?)`, [values.username, values.total_books]);
        connection.release();
        console.log("author added");
        return "author added";
    }catch(err){
        console.log(err)
        connection.release();
    }
}

export default router;
