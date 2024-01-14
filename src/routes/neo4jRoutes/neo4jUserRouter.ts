import express from "express";
import env from "dotenv";
import bcrypt from "bcrypt";
import { driver } from "../../db_services/neo4j/neo4jConnSetup";
import { v4 as uuid } from 'uuid';


env.config();

const router = express.Router();
router.use(express.json());

// Create user
router.post("/neo4j/create/user", async (req, res) => {
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

// Get all users
router.get("/neo4j/users", async (req, res) => {
    try {
        const result: any = await getAllUsers();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with user login");
    }
});

export async function getAllUsers() {
    const session = driver.session();

    try {
        const result = await session.run(
            `MATCH (u:User)-[:HAS_USER_DATA]->(ud:UserData) RETURN u, ud`
        );
        const users = result.records.map((record) => {
            return {
                user: record.get('u').properties,
                userData: record.get('ud').properties
            };
        });
        return users;
    } catch (error) {
        console.error('Error getting all users:', error);
    } finally {
        await session.close();
    }
}

router.put("/neo4j/update/user", async (req, res) => {
    try {
        const result: any = await updateUser(req.body);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with user login");
    }
});

//updateUser
async function updateUser(value: any) {
    const session = driver.session();
    try{
        const result = await session.run(
            `MATCH (u:User)-[:HAS_USER_DATA]->(ud:UserData) 
            WHERE u.user_id = $userId AND ud.email = $email SET ud.first_name = $firstName, ud.last_name = $lastName, 
            ud.email = $email, ud.password = $password RETURN u, ud`,
            {
                userId: value.userId,
                email: value.email,
                firstName: value.firstName,
                lastName: value.lastName,
                password: value.password
            });
        const user = result.records.map((record) => {
            return {
                user: record.get('u').properties,
                userData: record.get('ud').properties
            };
        });

       
        return user;


    }catch(error){
        console.error('Error updating user:', error);
    }finally{
        await session.close();
    }
}

router.get("/neo4j/users/:id", async (req, res) => {
    try {
        const result: any = await getUserById(req.body);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with user login");
    }
});

async function getUserById(id:string) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User)-[:HAS_USER_DATA]->(ud:UserData) WHERE u.user_id = $userId RETURN u, ud`,
            {
                userId: id
            }
        );
        const user = result.records.map((record) => {
            return {
                user: record.get('u').properties,
                userData: record.get('ud').properties
            };
        });
        return user;
    } catch (error) {
        console.error('Error getting user by id:', error);
    } finally {
        await session.close();
    }

};

router.put("/neo4j/deleteUser/:userId", async (req, res) => {
    try {
        console.log("USER ID: ", req.body)
        const result = await deleteUser(req.body);
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong with user login");
    }
});

async function deleteUser(id:string) {
    const session = driver.session();
    try {
        const result = await session.run(
            `MATCH (u:User)-[:HAS_USER_DATA]->(ud:UserData) 
            WHERE u.user_id = $userId SET u.is_deleted = true, u.deleted_at = timestamp() RETURN u, ud`,
            {
                userId: id
            }
        );
            
        console.log("User we are trying to delete: " + result)
        const user = result.records.map((record) => {
            return {
                user: record.get('u').properties,
                userData: record.get('ud').properties
            };
        });
        return user;
    } catch (error) {
        console.error('Error deleting user:', error);
    } finally {
        await session.close();
    }
}

export default router;