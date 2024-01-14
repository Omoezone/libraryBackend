import express from "express";
import { driver } from "../../db_services/neo4j/neo4jConnSetup";
import { v4 as uuid } from 'uuid';
import { verifyRole } from "./neo4jAuthRouter";
const router = express.Router();

//getAllAuthors virker
router.get("/neo4j/authors", async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', ''); 
        if(!token){
            throw new Error("Authorization token is not provided");
        }
        console.log("token: ", token)       
        if(!verifyRole(token, ["admin", "audit"])){
            res.status(401).send("Your role is not authorized to get all authors");
        };
        const result: any = await getAllAuthors();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with getting all authors");
    }
});

async function getAllAuthors() {
    const session = driver.session();
    try{
        const result = await session.run(
            `MATCH (a:Author) RETURN a`
        );
        const allAuthors = result.records.map((record) => {
            return {
                id: record.get("a").properties.author_id,
                username: record.get("a").properties.username,
                total_books: record.get("a").properties.total_books
            };
            }); 
            console.log("Success getting all authors: ", allAuthors);
            return allAuthors;
    }catch(error){
        console.log(error);
        console.log("Something went wrong with getAllAuthors");
    }finally{
        await session.close();
    }
}

//createAuthor virker!
router.post("/neo4j/create/author", async (req, res) => {
    try {
        const result: any = await createAuthor(req.body);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with creating author");
    }
});


async function createAuthor(value : any){
    const session = driver.session();
    try{
        const trans = session.beginTransaction();

        const createAuthor = await trans.run(
            `CREATE (a:Author {
                author_id: $authorDataId,
                username: $username,
                total_books: $totalBooks
            }) RETURN a`,
            {
                authorDataId: uuid(),
                username: value.username,
                totalBooks: value.totalBooks
            }
        );
        
        const createdAuthor = createAuthor.records[0].get("a");
        console.log("Author created: " + createdAuthor)
        
        const createAuthorData = await trans.run(
            `CREATE (ad:AuthorData {
                author_data_id: $authorDataId,
                username: $username,
                total_books: $totalBooks
            }) RETURN ad`,
            {
                authorDataId: uuid(),
                username: value.username,
                totalBooks: value.totalBooks
            }
        );
        
        const createdAuthorData = createAuthorData.records[0].get("ad");

        
        // Create relationship between Author and AuthorData
        await trans.run(
            `MATCH (a:Author), (ad:AuthorData) WHERE a.author_id = $authorId AND ad.author_data_id = $authorDataId CREATE (a)-[:HAS_AUTHOR_DATA]->(ad)`,
            {
                authorId: createdAuthor.properties.author_id,
                authorDataId: createdAuthorData.properties.author_data_id
            }
        );
        await trans.commit();
        console.log("Successfully created a author: ", createdAuthor);
        return {
            author: createdAuthor.properties,
            authorData: createdAuthorData.properties
        }; 
    }catch(error){
        console.log(error);
        console.log("Something went wrong with createAuthor, ", error);
    }finally{
        await session.close();
    }
}

router.delete("/neo4j/delete/author/:id", async (req, res) => {
    try {
        const result: any = await deleteAuthor(req.body);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with deleting author");
    }
});

async function deleteAuthor(id: string){
    const session = driver.session();
    try{
        const trans = driver.session().beginTransaction();

        const result = await trans.run( 
            'MATCH (a:Author) WHERE a.author_id = $authorId DETACH DELETE a',
            {
                authorId: id
            }
        ); 
        const author = result.records[0].get("a");
        return{
            author : author.properties
        }
        return author;
    }catch(error){
        console.log(error);
        console.log("Something went wrong with deleteAuthor, ", error);
    }finally{
        await session.close();
    }
}
export default router;