import express from 'express';
import logger from '../../other_services/winstonLogger';
import Books from '../../other_services/mongoSchemas/bookSchema';

const router = express.Router();
router.use(express.json());

//TODO: 
//GetBookBtAuthor

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
        const books = await Books.find({});
        return books;
    } catch (error) {
        logger.error("Error in getting all books: [Mongo getAllBooks, 2]",error);
        throw error;
    } 
}


//Create book virker
router.post("/mongo/book/create", async (req, res) => {
    try{
        console.log(req.body)
        const result = await createBook(req.body.title, req.body.picture, req.body.summary, req.body.pages, req.body.mount, req.body.available_amount);
        res.status(200).send(result);
        console.log("Book created: ", result)
    }catch(error){
        logger.error("Error in creating book: [Mongo createBook, 1]",error);
        throw error;
    }

});


async function createBook(title : string, picture : string, summary : string, pages : number, mount : number, available_amount : number){
    try {
    const newBook = new Books( {
        title: title,
        picture: picture,
        summary: summary,
        pages: pages,
        amount: mount,
        available_amount: available_amount,
    })
        const result = await newBook.save(); 
        if(!result){
            throw new Error("Book not created");
        }else{
            return result;
        }
    } catch (error) {
        logger.error("Error in creating a new book: [Mongo new book, 1]", error);
        throw error;
    }
}

export default router;