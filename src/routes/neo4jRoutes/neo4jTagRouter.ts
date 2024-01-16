import express from 'express';
import { driver } from '../../db_services/neo4j/neo4jConnSetup'
import logger from '../../other_services/winstonLogger';
import { verifyRole } from './neo4jAuthRouter';

const router = express.Router();
router.use(express.json());

//readAll Tags 
router.get('/neo4j/tags', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log("token: ", token)
        if (!token) {
            res.status(401).send("Authorization token is not provided");
            return;
        }else{
            if(!(await verifyRole(token, ["admin", "audit"]))){
                res.status(401).send("No access for your role");
                return;
            }
        }
        const result: any = await getAllTags();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
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
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).send("Authorization token is not provided");
            return;
        }else{
            if(!(await verifyRole(token, ["admin"]))){
                res.status(401).send("No access for your role");
                return;
            }
        }
        const result: any = await createTag(req.body);
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong with creating tag');
    }

}); 

async function createTag(value: any) {
    const session = driver.session();
    
    try {
        const trans = await session.beginTransaction();

        // Create Tag
        const createTagQuery = `
            CREATE (t:Tag {
                title: $title,
                tag_description: $tagDescription
            }) RETURN t`;

        const createTagResult = await trans.run(createTagQuery, {
            title: value.title,
            tagDescription: value.tag_description
        });

        const createdTag = createTagResult.records[0].get('t');

        // Create TagData
        const createTagDataQuery = `
            CREATE (td:TagData {
                title: $tagDataTitle,
                tag_description: $tagDataDescription
            }) RETURN td`;

        const createTagDataResult = await trans.run(createTagDataQuery, {
            tagDataTitle: value.title,  // Use a different parameter name
            tagDataDescription: value.tag_description
        });

        const createdTagData = createTagDataResult.records[0].get('td');

        // Create relationship between Tag and TagData
        const createRelationshipQuery = `
            MATCH (t:Tag), (td:TagData) 
            WHERE t.title = $tag AND td.title = $tagDataTitle
            CREATE (t)-[r:HAS_TAG_DATA]->(td) RETURN r`;

        await trans.run(createRelationshipQuery, {
            tag: createdTag.properties.title,
            tagDataTitle: createdTagData.properties.title
        });

        await trans.commit();
        console.log("Successfully created tag: ", createdTag.properties);
        
        return {
            tag: createdTag.properties,
            tagData: createdTagData.properties
        };
        
    } catch (error) {
        logger.error(error);
        console.log("Something went wrong with createTag");
        
    } finally {
        await session.close();
    }
}

router.get('/neo4j/Onetag', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).send("Authorization token is not provided");
            return;
        }else{
            if(!(await verifyRole(token, ["admin", "audit"]))){
                res.status(401).send("No access for your role");
                return;
            }
        }
        const result: any = await oneTag(req.body);
        res.status(200).send(result);
    } catch (err) {
        logger.error(err);
        res.status(401).send('Something went wrong with finding tag by id');
    }

});

async function oneTag(tag_desrip: any){
    const session = driver.session();
    try{

        //Tjeck om tag findes
        const result = await session.run(
            `MATCH (t:Tag) WHERE t.tag_description = $tag_description RETURN t`,
            {
                tag_description: tag_desrip.tag_description
            }
        );
        if(result.records.length === 0){
            throw new Error(`Tag with tag_description ${tag_desrip.tag_description} not found`);
        }

        const tag = result.records[0].get('t');
        console.log("Successfully found tag: ", tag.properties);

        return tag.properties;

    }catch(error){
        logger.error(error);
        console.log("Something went wrong with oneTag");
    }finally{
        await session.close();
    }
}

router.delete('/neo4j/delete/tag', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).send("Authorization token is not provided");
            return;
        }else{
            if(!(await verifyRole(token, ["admin"]))){
                res.status(401).send("No access for your role");
                return;
            }
        }
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