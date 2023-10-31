import express from 'express';
import logger from '../../other_services/winstonLogger';
import Book from '../../other_services/mongoSchemas/bookSchema';
import User from '../../other_services/mongoSchemas/userDataSchema';

const router = express.Router();
router.use(express.json());


router.get("/mongo/books", async (req, res) => {
    try {
        console.log("Getting all books")
        const result = await getAllBooksMongo();
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error in getting all books: [Mongo getAllBooks, 1]",error);
        res.status(500).send(error);
    }
});

async function getAllBooksMongo() {
    try {
        const books = await Book.find({});
        return books;
    } catch (error) {
        logger.error("Error in getting all books: [Mongo getAllBooks, 2]",error);
        throw error;
    } 
}

router.get("/mongo/books/:id", async (req, res) => {
    try {
        const result = await getBookByIdMongo(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error in getting book by id: [Mongo getBookById, 1]",error);
        res.status(500).send(error);
    }
});

async function getBookByIdMongo(id:string) {
    try {
        console.log("Entering getBookByIdMongo")
        const book = await Book.findById(id);
        return book;
    } catch (error) {
        logger.error("Error in getting book by id: [Mongo getBookById, 2]",error);
        throw error;
    }
}

router.get("/mongo/users", async (req, res) => {
    try {
        const result = await getAllUsersMongo();
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error in getting all users: [Mongo getAllUsers, 1]",error);
        res.status(500).send(error);
    }
});

async function getAllUsersMongo(){
    try {
        const users = await User.find({});
        return users;
    } catch (error) {
        logger.error("Error in getting all users: [Mongo getAllUsers, 2]",error);
        throw error;
    }
}

router.get("/mongo/users/:id", async (req, res) => {
    try {
        const result = await getUserByIdMongo(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error in getting user by id: [Mongo getUserById, 1]",error);
        res.status(500).send(error);
    }
});

async function getUserByIdMongo(id:string) {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        logger.error("Error in getting user by id: [Mongo getUserById, 2]",error);
        throw error;
    }
}

router.put("/mongo/deleteUser/:id", async (req, res) => {
    try {
        const result = await deleteUserMongo(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error in deleting book: [Mongo deleteBook, 1]",error);
        res.status(500).send(error);
    }
});

async function deleteUserMongo(id:string) {
    try {
        const user = await User.findById(id);

        if (!user) {
            throw new Error('User not found.');
        }
        user['is_deleted'] = true;
        user['deleted_at'] = new Date();
        await user.save();
        return user;
    } catch (error) {
        logger.error("Error in deleting book: [Mongo deleteBook, 2]",error);
        throw new Error('Error updating user: ' + error);
    }
}

export default router;

