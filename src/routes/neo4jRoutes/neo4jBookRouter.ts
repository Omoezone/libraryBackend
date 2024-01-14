import express from 'express';
import { driver } from '../../db_services/neo4j/neo4jConnSetup'
import { v4 as uuid } from 'uuid';
import logger from '../../other_services/winstonLogger';


const router = express.Router();
router.use(express.json());

router.get('/neo4j/books', async (req, res) => {  
    try {
        const result: any = await readAllBooks();
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong wi  th getting all books');
    }
});

// readAll Books
async function readAllBooks() {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (b:Book) RETURN b`
        );

        const allBooks = result.records.map((record: any) => {
            return {
                id: record.get("b").properties.book_id,
                title: record.get("b").properties.title,
                picture: record.get("b").properties.picture,
                summary: record.get("b").properties.summary,
                pages: record.get("b").properties.total_pages,
                amount: record.get("b").properties.amount,
                available_amount: record.get("b").properties.available_amount,
            };
        });
        console.log("Success getting all books: ", allBooks);
        return allBooks;
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong with readAllBooks");
    } finally {
        await session.close();
    }
}

//createBook virker!
router.post('/neo4j/create/book', async (req, res) => {
    try {
        const result: any = await createBook(req.body);
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong with creating book');
    }
});


async function createBook(value: any) {
    const session = driver.session();
    try {
        const trans = session.beginTransaction(); 

        // Create Book
        const createBook = await trans.run(
            `CREATE (b:Book {
                book_id: $bookDataId,
                title: $title,
                picture: $picture,
                summary: $summary,
                pages: $pages,
                amount: $amount,
                available_amount: $available_amount
            }) RETURN b`,
            {
                bookDataId: uuid(),
                title: value.title,
                picture: value.picture,
                summary: value.summary,
                pages: value.pages,
                amount: value.amount,
                available_amount: value.available_amount
            }
        );
        const createdBook = createBook.records[0].get("b"); 
        //console.log("Book created: " + createdBook)
        

        //create book data
        const bookData = await trans.run(
            `CREATE (bd:BookData {
                book_data_id: $bookDataId,
                title: $title,
                picture: $picture,
                summary: $summary,
                pages: $pages,
                amount: $amount,
                available_amount: $available_amount
            }) RETURN bd`,
            {
                bookDataId: uuid(),
                title: value.title,
                picture: value.picture,
                summary: value.summary,
                pages: value.pages,
                amount: value.amount,
                available_amount: value.available_amount
            }
        );
        const createdBookData = bookData.records[0].get("bd");
        //console.log("BookData created: " + createdBookData)

        //create relationship between Book and BookData
        await trans.run(
            `MATCH (b:Book), (bd:BookData) WHERE b.book_id = $bookId AND bd.book_data_id = $bookDataId CREATE (b)-[:HAS_BOOK_DATA]->(bd)`,
            {
                bookId: createdBook.properties.book_id,
                bookDataId: createdBookData.properties.book_data_id
            }
        );
        await trans.commit();
        console.log("Successfully created a book: ", createdBook.properties);
        return {
            book: createdBook.properties,
            bookData: createdBookData.properties
        };

    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong with createBook");
    } finally {
        await session.close();
    }
}

router.put("/neo4j/update/book", async (req, res) => {
    try{
        const result: any = await updateBook(req.body);
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        console.log("Something went wrong with updateBook, ", error);
    }
});


//updateBook virker!
const updateBook = async (value: any) => {
    const session = driver.session();
    try{
        const trans = session.beginTransaction();
        
        const checkAuthor = await trans.run(
            `MATCH (b:Book) WHERE b.book_id = $bookId RETURN b`,
            {
                bookId: value.bookId
            }
        );

        if(checkAuthor.records.length === 0){
            throw new Error("Book does not exist");
        }

        
        const result = await trans.run(
            `MATCH (b:Book) WHERE b.book_id = $bookId SET b.title = $title, b.picture = $picture, b.summary = $summary, b.pages = $pages, b.amount = $amount, b.available_amount = $available_amount RETURN b`,
            {
                bookId: value.bookId,
                title: value.title,
                picture: value.picture,
                summary: value.summary,
                pages: value.pages,
                amount: value.amount,
                available_amount: value.available_amount
            }
        );

        const updatedBook = result.records[0].get("b");
        console.log("Successfully updated book: ", updatedBook.properties);
        return {book : updatedBook.properties};
    }catch(error){
        logger.error(error);
        console.log("Something went wrong with updateBook, ", error);
    }finally{
        await session.close();
    }

}

router.get("/neo4j/book/:bookId", async (req, res) => {
    try{
        const result: any = await getBookById(req.body);
        res.status(200).send(result);
    }catch(error){
        logger.error(error);
        console.log("Something went wrong with getBookById, ", error);
    } 
});
async function getBookById(bookId: any) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (b:Book) WHERE b.book_id = $bookId RETURN b`,
            {
                bookId: bookId
            }
        );
        const book = result.records[0].get("b");
        console.log("Successfully found book: ", book.properties);
        return book.properties;
    } catch (error) {
        console.error(error);
        throw new Error("Something went wrong with getBookById");
    } finally {
        await session.close();
    }
}


export default router;
