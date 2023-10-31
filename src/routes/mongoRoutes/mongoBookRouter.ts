import express from 'express';
import logger from '../../other_services/winstonLogger';
import Book from '../../other_services/mongoSchemas/bookSchema';
import User from '../../other_services/mongoSchemas/userDataSchema';
import bcrypt from 'bcrypt';

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

router.post("/mongo/updateUser/:id", async (req, res) => {
    try {
        const result = await updateUserMongo(req.params.id, req.body);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error in updating user: [Mongo updateUser, 1]",error);
        res.status(500).send(error);
    }
});

async function updateUserMongo(id:string, body:any) {
    try {
        const user: any = await User.findById(id);

        if (!user) {
            throw new Error('User not found.');
        }

        for (const field in body) {
            if (field === 'user_data') {
                if (!Array.isArray(user.user_data)) {
                    user.user_data = [];
                }

                user.user_data.push(body[field]);
            } else if (user[field] !== undefined) {
                user[field] = body[field];
            }
        }

        await user.save();
        return user;
    } catch (error) {
        logger.error("Error in updating user: [Mongo updateUser, 2]", error);
    }
}

router.post("/mongo/user/create", async (req, res) => {
    try {
        const result = await createUser(req.body.first_name, req.body.last_name, req.body.email, req.body.password);
        res.status(200).json(result);
    } catch (err:any) {
        if (err.code == 409){
            res.status(409).send(err.message);
        } else {
            res.status(500).send("Something went wrong while creating user");
        }
    }
});

async function createUser(first_name: string, last_name: string, email: string, password: string) {
    try {
        console.log("Creating user")
        const hash = await bcrypt.hash(password, 10)
        if (await User.exists({"user_data.email": email}) != null) {
            throw {code: 409, message:"Email already exists"};
        }
        try {
            const user = await User.create({ user_data: { first_name: first_name, last_name: last_name, email: email, password: hash}});
            console.log("User created: ", user);
            return user;
        } catch (err) {
            logger.error("Error in hashing password: [Mongo createUser, 1]",err);
            throw err;
        }
    } catch (error) {
        logger.error("Error in creating user",error);
        throw error;
    }
}

export default router;

