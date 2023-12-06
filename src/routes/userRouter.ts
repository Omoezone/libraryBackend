import express from "express";
import { Request } from "express";
import conn from "../db_services/mysqlConnSetup";
import bcrypt from "bcrypt";
import { Book, BookInteraction, Review } from "../other_services/models/seqModels";
import { getUser } from "./authRouter";
import logger from "../other_services/winstonLogger";
import jwt, { JwtPayload } from "jsonwebtoken";

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
router.post("/user/:id/update", async (req, res) => {
    try{
        const userdata = jwt.verify(req.body.authToken, "secret") as JwtPayload;
        let paramsId: number = parseInt(req.params.id);
        if(userdata.user.users_data_id != paramsId) {
            res.status(401).json("You are not authorized to update this users data");
        }
        
        const result: any = await updateUser(paramsId, req.body.user);
        let jwtUser = {
            "users_data_id": result.users_data_id,
            "name_id": result.name_id,
            "user_id": result.user_id,
            "email": result.email,
            "pass": req.body.user.password,
            "snap_timestamp": result.snap_timestamp,
        }
        let resultWithToken = {"authToken": jwt.sign({ user: jwtUser }, "secret"), "user": result};
        console.log(resultWithToken);
        res.status(200).json(resultWithToken);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error");
    }
});

export async function updateUser(id: number, values: any) {
    const connection = await conn.getConnection();
    try {
        values.hash_password = await bcrypt.hash(values.password, 10);
        await connection.query(`CALL update_user(?,?,?,?,?,?)`, [values.name_id, values.first_name, values.last_name, id, values.email, values.hash_password]);
        connection.release();
        const updatedUser = await getUser(values.email, values.password);
        return updatedUser;
    }catch(err){
        console.log(err)
        connection.release();
    }
}

// Interactions
router.post("/user/:id/borrow/:bookId", async (req, res) => {
    try{
        const result = await bookInteraction(req.params.id, req.params.bookId, "Borrowed");
        res.status(200).json(result);
    } catch (err) {
        logger.error("Error in creating a new book interaction: [createBorrowBook, 1]", err)
        res.status(500).json("Internal server error");
    }
});
router.post("/user/:id/bookmarked/:bookId", async (req, res) => {
    try{
        const result = await bookInteraction(req.params.id, req.params.bookId, "Bookmarked");
        res.status(200).json(result);
    } catch (err) {
        logger.error("Error in creating a new author: [createBookmarkBook, 1]", err)
        res.status(500).json("Internal server error");
    }
});
router.post("/user/:id/hasborrowed/:bookId", async (req, res) => {
    try{
        const result = await bookInteraction(req.params.id, req.params.bookId, "Has_Borrowed");
        res.status(200).json(result);
    } catch (err) {
        logger.error("Error in creating a new book interaction: [createHasBorrowedBook, 1]", err)
        res.status(500).json("Internal server error");
    }
});

export async function bookInteraction(id: string, bookId: string, interaction_type: string) {
    try {
        const result = await BookInteraction.create(
            {
                user_id: id,
                book_id: bookId,
                interaction_type: interaction_type,
            }
        );
        return result;
    } catch (error) {
        logger.error("Error in creating a new book interaction: [createBorrowBook, 2]", error);
    }
}

router.get("/user/:id/bookmarked/:bookId", async (req, res) => {
    try{
        const result = await getBookInteraction(req.params.id, req.params.bookId, "Bookmarked");
        res.status(200).json(result);
    } catch (err) {
        logger.error("Error in getting a bookInteractions: [getBookmarkBook, 1]", err)
        res.status(500).json("Internal server error");
    }
});

async function getBookInteraction(id: string, bookId: string, interaction_type: string) {
    try {
        const result = await BookInteraction.findAll({
            where: {
                user_id: id,
                book_id: bookId,
                interaction_type: interaction_type,
            }
        });
        return result;
    } catch (error) {
        logger.error("Error in getting a bookInteractions: [getBookmarkBook, 2]", error);
    }
}
router.get("/user/:id/bookmarked/", async (req, res) => {
    try{
        const result = await getBookInteractionByUser(req.params.id, "Borrowed");
        res.status(200).json(result);
    } catch (err) {
        logger.error("Error in getting a bookInteractions: [getBorrowedBook, 1]", err)
        res.status(500).json("Internal server error");
    }
});

async function getBookInteractionByUser(id: string, interaction_type: string) {
    try {
        const result = await BookInteraction.findAll({
            where: {
                user_id: id,
                interaction_type: interaction_type,
            },
            include: [
                {
                    model: Book,
                    attributes: ["title", "book_id"],
                }
            ],
        });
        return result;
    } catch (error) {
        logger.error("Error in getting a bookInteractions: [getBorrowedBook, 2]", error);
    }
}

router.delete("/user/:id/bookmarked/:bookId", async (req, res) => {
    try{
        const result = await deleteBookInteraction(req.params.id, req.params.bookId, "Bookmarked");
        res.status(200).json(result);
    } catch (err) {
        logger.error("Error in deleting a bookInteractions: [deleteBookmarkBook, 1]", err)
        res.status(500).json("Internal server error");
    }
});
async function deleteBookInteraction(id: string, bookId: string, interaction_type: string) {
    try {
        const result = await BookInteraction.destroy({
            where: {
                user_id: id,
                book_id: bookId,
                interaction_type: interaction_type,
            }
        });
        return result;
    } catch (error) {
        logger.error("Error in deleting a bookInteractions: [deleteBookmarkBook, 2]", error);
    }
}

// Return book
router.put("/user/:id/return/:bookId", async (req, res) => {
    try{
        const result = await returnBook(req.params.id, req.params.bookId);
        res.status(200).json(result);
    } catch (err) {
        logger.error("Error in returning a book: [returnBook, 1]", err)
        res.status(500).json("Internal server error");
    }
});

export async function returnBook(id: string, bookId: string) {
    try {
        const result = await BookInteraction.update(
            { 
                interaction_type: "Has_Borrowed",
            },
            {
                where: {
                    user_id: id,
                    book_id: bookId,
                    interaction_type: "Borrowed",
                }
            });
        
        return result;
    } catch (error) {
        logger.error("Error in returning a book: [returnBook, 2]", error);
    }
}
// Create review
router.post("/user/:id/review/:bookId/:stars", async (req, res) => {
    try{
        const result = await createReview(req.params.id, req.params.bookId, req.params.stars);
        res.status(200).json(result);
    } catch (err) {
        logger.error("Error in creating a new review: [createReview, 1]", err)
        res.status(500).json("Internal server error");
    }
});

export async function createReview(id: string, bookId: string, stars: string) {
    try {
        const result = await Review.create(
            {
                user_id: id,
                book_id: bookId,
                stars: stars,
            }
        );
        return result;
    } catch (error) {
        logger.error("Error in creating a new review: [createReview, 2]", error);
    }
}

export default router;