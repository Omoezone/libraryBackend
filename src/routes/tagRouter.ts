import express from 'express';
import conn from '../db_services/mysqlConnSetup';

const router = express.Router();
router.use(express.json());

// Get all tags
router.get("/tags", async (req, res) => {
    try {
        const result: any = await getAllTags();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with fetching tags");
    }
});

export async function getAllTags() {
    const connection = await conn.getConnection();
    try{
        const [rows] = await connection.query(`SELECT * FROM tags`);
        connection.release();
        return rows;
    }catch(err){
        console.log("no tags found: ", err);
        connection.release();
    }
}

// create tag
router.post("/tag", async (req, res) => {
    try {
        const result: any = await createTag(req.body);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with creating tag");
    }
});

export async function createTag(values: any) {
    const connection = await conn.getConnection();
    try{
        const [rows] = await connection.query(`INSERT INTO tags (title, tag_description) VALUES (?,?)`, [values.title, values.tag_description]);
        connection.release();
        return rows;
    }catch(err){
        console.log("no tag created: ", err);
        connection.release();
    }
}

// add tag to book
router.post("/bookTag", async (req, res) => {
    try {
        const result: any = await addTagToBook(req.body);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong with adding tag to book");
    }
});

export async function addTagToBook(values: any) {
    const connection = await conn.getConnection();
    try{
        const [rows] = await connection.query(`INSERT INTO tag_books (book_id, tag_id) VALUES (?,?)`, [values.book_id, values.tag_id]);
        connection.release();
        return rows;
    }catch(err){
        console.log("no tag added to book: ", err);
        connection.release();
    }
}

export default router;