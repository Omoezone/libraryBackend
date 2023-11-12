import express from 'express';
import { Request } from 'express';
import { Author, Book } from '../other_services/models/seqModels';
import logger from '../other_services/winstonLogger';

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
        console.log(result.every((author) => author instanceof Author));
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

export default router;
