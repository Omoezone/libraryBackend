import express from 'express';
import { driver } from '../../db_services/neo4j/neo4jConnSetup';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express();
router.use(express.json());

router.post("/neo4j/signup", async (req, res) => {
    try{
        const result: any = await createUser(req.body);
        let jwtUser = {
            "user_id": result.user.user_id,
            "created_at": result.user.created_at,
            "is_deleted": result.user.is_deleted,
            "deleted_at": result.user.deleted_at
        }
        let resultWithToken = {"authToken": jwt.sign({ user: jwtUser}, "secret"), "user": result};
        res.status(200).json(resultWithToken);
        
    }catch(error){
        console.log(error);
        res.status(401).send("Something went wrong with signup");
    }
});

router.post("/neo4j/login", async (req, res) => {  
    try {
        const result: any = await login(req.body);
        console.log("result: ", result);
        let jwtUser = {
            "role": result.userData.role,
        }
    
        const authToken = jwt.sign({ user: jwtUser}, "secret");
        res.setHeader('Authorization', `Bearer ${authToken}`); 
         

        let resultWithToken = {"authToken": jwt.sign({ user: jwtUser}, "secret"), "user": result};
        res.status(200).json(resultWithToken);
        
    }catch(error){
        console.log(error);
        res.status(401).send("Something went wrong with login");
    }

});

router.post("/neo4j/verify", async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log("token: ", token)
        if (!token) {
            throw new Error("Authorization token is not provided");
        }

        const decoded = jwt.verify(token, 'secret');
        console.log("decoded user: ", decoded);
        res.status(200).json({message: "User is verified!!"});

    } catch (error) {
        console.log(error);
        res.status(401).send("Something went wrong with user login");
    }
});

async function login(value: any){
    const session = driver.session();
    try{

        const user = await session.run(
            `MATCH (u:User)-[:HAS_USER_DATA]->(ud:UserData) WHERE ud.email = $email RETURN u, ud`,
            {
                email: value.email
            }
        );
        const userRecord = user.records[0];
        const userNode = userRecord.get('u');
        const userDataNode = userRecord.get('ud');

        return {
            user: userNode.properties,
            userData: userDataNode.properties
        };

    }catch(error){
        console.log("Error en getting user: ", error);
        console.log(error);
    }finally{
        await session.close();
    }
}


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

        // Create UserData
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
                password: value.password,
                firstName: value.firstName,
                lastName: value.lastName
            }
        );
    
        const createdUserData = userDataResult.records[0].get('ud');

        await trans.run(
            'MATCH (u:User), (ud:UserData) WHERE u.user_id = $userId AND ud.email = $email CREATE (u)-[:HAS_USER_DATA]->(ud)',
            {
                userId: createdUser.properties.user_id,
                email: createdUserData.properties.email, 
               
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

export async function verifyRole(user: any, requiredRoles: string[]) {
    user = jwt.verify(user, 'secret');
    const value = requiredRoles.includes(user.user.role);
    return value;
};

export default router;