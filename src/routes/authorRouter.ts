import express from 'express';
import { Request } from 'express';
import { Author, Book, FavoritedAuthor } from '../other_services/models/seqModels';
import logger from '../other_services/winstonLogger';
import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();
router.use(express.json());

// --------------- Get all authors ----------------
router.get("/authors", async (req, res) => {
    try {
        const result: Author[] = await getAllAuthors();
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error in getting all authors: [getAllAuthors, 1]",error);
        res.status(500).send(error);
    }
});

export async function getAllAuthors() {
    try{
        const result: Author[] = await Author.findAll();
        if(!result) throw new Error("No authors found");
        const authorArray = result.map((author) => author.toJSON());
        return authorArray;
    }catch(error){
        logger.error("Error in getting all authors: [getAllAuthors, 2]",error);
        throw error;
    } 
}

// -------------------- Get author by id --------------------
router.get("/author/:id", async (req: Request<{ id: number}>, res) => {
    try {
        const result: Author = await getAuthorById(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error with fetching author: [getAuthorById, 1] ", error);
        res.status(500).send(error);
    }
});
//FIXME: why are we doing | null here?
export async function getAuthorById(id: number) {
    try{
        const result: Author | null = await Author.findByPk(id);
        if(result === null) throw new Error("No author found with the given id");
        return result;
    }catch(error){
        logger.error("Error with fetching author: [getAuthorById, 2] ", error);
        throw error;
    }
}
// create author
// TODO: look into making total_books set automatically prop with trigegrs
router.post("/author",  async (req, res) => {
    try{
        const result: Author = await createAuthor(req.body);
        res.status(200).json(result);
    } catch (error) {
        logger.error("Error in creating a new author: [createAuthor, 1]", error);
        res.status(500).json(error);
    }
});

export async function createAuthor(values: Author) {
    try {
        const author = await Author.create({
            username: values.username,
            total_books: values.total_books,
        });
        return author.toJSON();
    }catch(err){
        logger.error("Error in creating a new author: [createAuthor, 2]",err)
        throw err;
    }
}

// get all books for author
router.get("/author/:id/books", async (req: Request<{ id: number}>, res) => {
    try {
        const result: Book[] = await getAuthorBooks(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error with fetching all books for author: [getAuthorBooks, 1] ", error);
        res.status(500).send(error);
    }
});

export async function getAuthorBooks(id: number) {
    try{
        const result: Book[] = await Book.findAll({
            where: {
                author_id: id,
            }
        });
        if(result === null) 
            throw new Error("No author found with the given id");
        return result;
    }catch(error){
        logger.error("Error with fetching all books for author: [getAuthorBooks, 2] ", error);
        throw error;
    }
}

// Get favorited author
router.get("/user/:id/author/:authorid", async (req, res) => {
    try {
        const result = await getFavoritedAuthor(req.params.id, req.params.authorid);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error with getting a favorited ", error);
        res.status(500).send(error);
    }
});

export async function getFavoritedAuthor(id: string, authorid: string) {
    try{
        const result: FavoritedAuthor | null = await FavoritedAuthor.findOne({
            where: {
                author_id: authorid,
                user_id: id,
            }
        });
        return result;
    } catch (error){
        logger.error("Error with getting a favorited connection", error);
        throw error;
    }
}

// Create favorited author
router.post("/user/:userid/author/:authorid", async (req, res) => {
    try {
        const clones = await FavoritedAuthor.findAll({
            where: {
                user_id: req.params.userid,
                author_id: req.params.authorid,
            }
        });
        if(clones.length > 0) {
            res.status(200).send("Already favorited");
            return;
        }
        const result = await createFavoritedAuthor(req.params.userid, req.params.authorid);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error with creating a favorited ", error);
        res.status(500).send(error);
    }
});

export async function createFavoritedAuthor(id: string, authorid: string) {
    try{
        const result: FavoritedAuthor = await FavoritedAuthor.create({
            author_id: authorid,
            user_id: id,
        });
        return result;
    } catch (error){
        logger.error("Error with creating a favorited connection", error);
        throw error;
    }
}

router.delete("/user/:userid/author/:authorid", async (req, res) => {
    try {
        const result = await deleteFavoritedAuthor(req.params.userid, req.params.authorid);
        res.status(200).send(result);
    } catch (error) {
        logger.error("Error with deleting a favorited ", error);
        res.status(500).send(error);
    }
});

export async function deleteFavoritedAuthor(id: string, authorid: string) {
    try{
        const result: number = await FavoritedAuthor.destroy({
            where: {
                author_id: authorid,
                user_id: id,
            }
        });
        return result;
    } catch (error){
        logger.error("Error with deleting a favorited connection", error);
        throw error;
    }
}

export default router;
