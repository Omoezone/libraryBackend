import express from 'express';
import { driver } from '../../db_services/neo4j/neo4jConnSetup'
import { v4 as uuid } from 'uuid';
import logger from '../../other_services/winstonLogger';


const router = express.Router();
router.use(express.json());

//readAll Tags 
router.get('/neo4j/tags', async (req, res) => {
    try {
        const result: any = await getAllTags();
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong with getting all tags');
    }
});

async function getAllTags() {
    const session = driver.session();
    try{
        const result = await session.run(
            `MATCH (t:Tag) RETURN t`
        );

        const allTags = result.records.map((record:any) => {
            return {
                id: record.get("t").properties.tag_id,
                title: record.get("t").properties.title,
                tag_description: record.get("t").properties.tag_description
            };
            }); 
            console.log("Success getting all tags: ", allTags);
            return allTags;
    }catch(error){
        logger.error(error);
        console.log("Something went wrong with getAllTags");
    }finally{
        await session.close();
    }

}


router.post('/neo4j/create/tag', async (req, res) => {
    try {
        const result: any = await createTag(req.body);
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong with creating tag');
    }

}); 


//createTag
async function createTag(value: any){
    const session = driver.session();
    try{
        const trans = await session.beginTransaction();

        //Create Tag
        const createTag = await trans.run(
            `CREATE (t:Tag {
                tag_id: $tagId,
                title: $title,
                tag_description: $tagDescription
            }) RETURN t`,
            {
                tagId: uuid(),
                title: value.title,
                tagDescription: value.tag_description
            }
        );
        const createdTag = createTag.records[0].get('t');

        //create Tagdata
        const tagData = await trans.run(
            `CREATE (td:TagData {
                tag_data_id: $tagDataId,
                total_books: $totalBooks
            }) RETURN td`,
            {
                tagDataId: uuid(),
                totalBooks: value.total_books  // Updated parameter name
            }
        );
        
        const createdTagData = tagData.records[0].get('td');
        
        //create relationship between Tag and TagData
        const tagDataResult = await trans.run(
            `MATCH (t:Tag), (td:TagData) WHERE t.tag_id = $tagId AND td.tag_data_id = $tagDataId CREATE (t)-[:HAS_TAG_DATA]->(td) RETURN td`,
            {
                tagId: createdTag.properties.tag_id,
                tagDataId: createdTagData.properties.tag_data_id
            }
        );        
        await trans.commit();
        const tagDataRelationship = tagDataResult.records[0].get('td');

        console.log("Sucess fully created tag: ", createdTag.properties);
        return {
            tag: createdTag.properties,
            tagData: createdTagData.properties,
            tagDataRelationship: tagDataRelationship
        };
        
    }catch(error){
        logger.error(error);
        console.log("Something went wrong with createTag");
    }finally{
        await session.close();
    }
}

router.put('/neo4j/update/tag', async (req, res) => {
    try {
        const result: any = await updateTagByTitle(req.body);
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong with updating tag');
    }

});


//Update tag virker!
async function updateTagByTitle(value: any) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (t:Tag) WHERE t.title = $title RETURN t`,
            {
                title: value.title
            }
        );

        if (result.records.length === 0) {
            throw new Error(`Tag with title ${value.title} not found`);
        }

        const tag = result.records[0].get('t');

        await session.run(
            `MATCH (t:Tag) WHERE t.title = $title
            SET t.title = $newTitle, t.tag_description = $newDescription
            RETURN t`,
            {
                title: value.title,
                newTitle: value.newTitle,
                newDescription: value.newDescription
            }
        );

        console.log("Tag updated:", tag.properties);
        return { tag: tag.properties };

    } catch (error) {
        logger.error(error);
        console.log("Something went wrong with updating tag:", error);
    } finally {
        await session.close();
    }
}


router.get('/neo4j/find/tag/id', async (req, res) => {
    try {
        const result: any = await findTagById(req.body);
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong with finding tag by id');
    }

});

async function findTagById(tagId: string) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (t:Tag) WHERE t.tag_id = $tagId RETURN t`,
            {
                tagId: tagId
            }
        );

        if (result.records.length === 0) {
            throw new Error(`Tag with id ${tagId} not found`);
        }

        const tag = result.records[0].get('t');

        return tag;

    } catch (error) {
        logger.error(error);
        console.log("Something went wrong with finding tag by id:", error);
    } finally {
        await session.close();
    }
}

router.delete('/neo4j/delete/tag', async (req, res) => {
    try {
        const result: any = await deleteTag(req.body);
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong with deleting tag');
    }

});


async function deleteTag(value: any) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (t:Tag) WHERE t.title = $title RETURN t`,
            {
                title: value.title
            }
        );

        if (result.records.length === 0) {
            throw new Error(`Tag with title ${value.title} not found`);
        }

        const tag = result.records[0].get('t');

        await session.run(
            `MATCH (t:Tag) WHERE t.title = $title DETACH DELETE t`,
            {
                title: value.title
            }
        );

        console.log("Tag deleted:", tag.properties);
        return { tag: tag.properties };

    } catch (error) {
        logger.error(error);
        console.log("Something went wrong with deleting tag:", error);
    } finally {
        await session.close();
    }
}




export default router;