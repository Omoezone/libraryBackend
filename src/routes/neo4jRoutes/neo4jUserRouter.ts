import express from "express";
import env from "dotenv";
import bcrypt from "bcrypt";
import { driver } from "../../db_services/neo4j/neo4jConnSetup";
import { v4 as uuid } from 'uuid';


env.config();

const router = express.Router();
router.use(express.json());

router.post("/neo4j/user", async (req, res) => {
    try {
        const result: any = await createUser(req.body);
        res.status(201).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with user login");
    }
});

export async function createUser(value: any) {
    const session = driver.session();

    try {
        const trans = await session.beginTransaction();
        // Create User node
        const userResult = await trans.run(
            `CREATE (u:User {
                user_id: $userId,
                created_at: timestamp(),
                is_deleted: false,
                deleted_at: null
            }) RETURN u`,
            {
                userId: uuid()
            }
        );

        const createdUser = userResult.records[0].get('u');

        // Create UserData node
        const userDataResult = await trans.run(
            `CREATE (ud:UserData {
                email: $email,
                password: $password,
                first_name: $firstName,
                last_name: $lastName,
                snap_timestamp: timestamp()
            }) RETURN ud`,
            {
                email: value.email,
                password: bcrypt.hashSync(value.password, 10),
                firstName: value.firstName,
                lastName: value.lastName
            }
        );

        const createdUserData = userDataResult.records[0].get('ud');

        // Create relationship between User and UserData
        await trans.run(
            'MATCH (u:User), (ud:UserData) WHERE u.user_id = $userId AND ud.email = $email CREATE (u)-[:HAS_USER_DATA]->(ud)',
            {
                userId: createdUser.properties.user_id,
                email: createdUserData.properties.email
            }
        );
        await trans.commit();
        console.log('User and UserData created with relationship');
        return {
            user: createdUser.properties,
            userData: createdUserData.properties
        };
    }catch (error) {
        console.error('Error creating user:', error);
    } finally {
        await session.close();
    }
}

export default router;