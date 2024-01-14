import express from 'express';
import logger from '../../other_services/winstonLogger';
import tag from '../../other_services/mongoSchemas/tagSchema';
import book from '../../other_services/mongoSchemas/bookSchema';
import mongoose from 'mongoose';

const router = express.Router();
router.use(express.json());


router.post("/mongo/tagBook" , async (req, res) => {
    console.log("Adding tag to book")
    try{
        const result = await addTagToBook(req.body.book_id, req.body.tagId);
        res.status(200).send(result);
    }catch(error){
        logger.error("Error in adding tag to book: [Mongo addTagToBook, 2]")
        throw error;
    }
});

async function addTagToBook(book_id: number, tag_id: number){
    try{
  
        const getBookId = await new mongoose.Types.ObjectId(book_id);
        const getTagId = await new mongoose.Types.ObjectId(tag_id);

        if(getBookId && getTagId){
            const result = await book.updateOne(
                {_id: book_id}, 
                {$push: {tags: tag_id}}
                );
            console.log("Tag added to book successfully: ", result);
            return result;
        }
    }catch(error){
        logger.error("Error in adding tag to book: [Mongo addTagToBook, 1]")
        throw error;
    }
}

router.get("/mongo/tags", async (req, res) => {
    console.log("Getting all tags")
    try{

        const result = await viewAllTags();
        res.status(200).send(result);

    }catch(error){
        logger.error("Error in getting all tags: [Mongo getAllTags, 1]",error);
        throw error;
    }

}); 

async function viewAllTags(){
    try{
        const tags = await tag.find({});
        return tags;
    }catch(error){
        logger.error("Error in getting all tags: [Mongo getAllTags, 2]",error);
        throw error;
    }
}

//create tag
router.post("/mongo/tag/create", async (req, res) => {
    console.log("Creating tag")
    try{
        const result = await createTag(req.body.title, req.body.tag_description);
        res.status(200).send(result);
    }catch(error){
        logger.error("Error in creating tag: [Mongo createTag, 1]",error);
        throw error;
    }
});

async function createTag(title : string, tag_description : string){
    try{
        const newTag = new tag({
            title,
            tag_description
        
        });
        const result = await newTag.save();
        return result;
    }catch(error){
        logger.error("Error in creating tag: [Mongo createTag, 2]",error);
        throw error;
    }
}

//Find tag by id
router.get("/mongo/tag/:id", async (req, res) => {
    console.log("Getting tag by id")
    try{
        const result = await viewTagById(req.body.id);
        res.status(200).send(result);
    }catch(error){
        logger.error("Error in getting tag by id: [Mongo viewTagById, 1]",error);
        throw error;
    }
});

async function viewTagById(id: number){
    try{
        const result = await tag.findById(id);
        return result;
    }catch(error){
        logger.error("Error in getting tag by id: [Mongo viewTagById, 2]",error);
        throw error;
    }
}

//update tag
router.put("/mongo/tag/update", async (req, res) => {
    console.log("Updating tag")
    try{
        const result = await updateTag(req.body.title, req.body.tag_description);
        res.status(200).send(result);
    }catch(error){
        logger.error("Error in updating tag: [Mongo updateTag, 2]",error);
        throw error;
    }
});

async function updateTag(title: string, tag_description: string){
    try{
        const result = await tag.updateOne({title: title}, {tag_description: tag_description});
        return result;
    }catch(error){
        logger.error("Error in updating tag: [Mongo updateTag, 1]",error);
        throw error;
    }
}

//delete tag
router.delete("/mongo/tag/delete", async (req, res) => {
    console.log("Deleting tag")
    try{
        const result = await deleteTag(req.body);
        res.status(200).send(result);
    }catch(error){
        logger.error("Error in deleting tag: [Mongo deleteTag, 1]",error);
        throw error;
    }
});

async function deleteTag(id: number){
    try{
        const result = await tag.deleteOne({_id: id});
        return result;
    }catch(error){
        logger.error("Error in deleting tag: [Mongo deleteTag, 2]",error);
        throw error;
    }
}


export default router;