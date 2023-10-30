import logger from "../../other_services/winstonLogger";
import mongoDbClient from "./mongoConnSetup";
import dotenv from "dotenv";
dotenv.config();

const seedData = async () => {
    try{
        await resetDcuments(mongoDbClient);
        await userSeed(mongoDbClient);
        await bookSeed(mongoDbClient);
        await authorSeed(mongoDbClient);
        console.log("Done seeding ALL data for mongo");
    }catch(err){
        logger.error(err);
    }
}

const userSeed = async (db: any) => {
    try{
        const users = db.collection("users");
        const userData = [
            {
                "created_at": Date(),
                "is_deleted": false,
                "deleted_at": null,
                "user_data": {
                    "email": "testMail1@mail.dk",
                    "password": "Password1",
                    "user_name": {
                        "first_name": "William",
                        "last_name": "omoe"
                    }
                },
                "bookInteractions": [
                    {
                        "bookId": null,
                        "intereactionType": "Borrowed"
                    }
                ],
                "favoritedAuthors": [
                    {
                        "username": "Johnny Sins",
                        "total_books": 4
                    }
                ]
            },
            {
                "created_at": Date(),
                "is_deleted": false,
                "deleted_at": null,
                "user_data": {
                    "email": "testMail2@mail.dk",
                    "password": "Password2",
                    "user_name": {
                        "first_name": "Rasmus",
                        "last_name": "koefoed"
                    }
                },
                "bookInteractions": [
                    {
                        "bookId": null,
                        "intereactionType": "Borrowed"
                    },
                    {
                        "bookId": null,
                        "intereactionType": "Borrowed"
                    }
                ],
                "favoritedAuthors": [
                    {
                        "username": "H.P. Lovecraft",
                        "total_books": 4
                    },
                    {
                        "username": "Jane Austen",
                        "total_books": 2
                    },
                    {
                        "username": "Thomas Erikson",
                        "total_books": 8
                    }
                ]
            }
        ];
        await users.insertMany(userData);
        console.log("Done seeding users for mongo");
    }catch(err){
        logger.error(err);
    }
}
const bookSeed = async (db: any) => {
    try{
    const books = db.collection("books");
    const bookData = [
        {
            "title": "Necronomicon",
            "picture": "sample.jpg1",
            "summary": "Sample book summary1",
            "pages": 300,
            "amount": 3,
            "available_amount": 1,
            "tags": [
                {
                    "title": "Horror",
                    "description": "The fantasical world of adventure"
                },
                {
                    "title": "Adventure",
                    "description": "A mighty adventure"
                }
            ],
            "author": {
                "username": "H.P. Lovecraft",
                "total_books": 4
            }
        },
        {
            "title": "Pride and prejudice",
            "picture": "sample.jpg2",
            "summary": "Sample book summary2",
            "pages": 423,
            "amount": 1,
            "available_amount": 1,
            "tags": [
                {
                    "title": "Romance",
                    "description": "Love and stuff"
                },
                {
                    "title": "Adventure",
                    "description": "A mighty adventure"
                }
            ],
            "author": {
                "username": "Jane Austen",
                "total_books": 2
            }
        },
        {
            "title": "Omringet af idioter",
            "picture": "sample.jpg3",
            "summary": "Sample book summary3",
            "pages": 122,
            "amount": 3,
            "available_amount": 2,
            "tags": [
                {
                    "title": "Biography",
                    "description": "Look at me, i am important"
                },
                {
                    "title": "Learning",
                    "description": "Teach me, senpai"
                }
            ],
            "author": {
                "username": "Thomas Erikson",
                "total_books": 1
            }
        },
        {
            "title": "UML for beginners",
            "picture": "sample.jpg4",
            "summary": "Sample book summary4",
            "pages": 984,
            "amount": 11,
            "available_amount": 7,
            "tags": [
                {
                    "title": "Boring",
                    "description": "So much boring info"
                },
                {
                    "title": "Learning",
                    "description": "Teach me, senpai"
                },
                {
                    "title": "Programming",
                    "description": "Code code code"
                },
                {
                    "title": "UML",
                    "description": "Unified Modeling Language"
                }
            ],
            "author": {
                "username": "Thomas Erikson",
                "total_books": 7
            }
        },
        {

            "title": "To Kill a Mockingbird",
            "picture": "sample.jpg5",
            "summary": "Sample book summary5",
            "pages": 74,
            "amount": 2,
            "available_amount": 2,
            "tags": [
                {
                    "title": "Romance",
                    "description": "Love and stuff"
                },
                {
                    "title": "Adventure",
                    "description": "A mighty adventure"
                },
                {
                    "title": "Boring",
                    "description": "So much boring info"
                },
                {
                    "title": "Learning",
                    "description": "Teach me, senpai"
                }
            ],
            "author": {
                "username": "Harper Lee",
                "total_books": 8
            }
        }];
        await books.insertMany(bookData);
        console.log("Done seeding books for mongo");
    }catch(err){
        logger.error(err);
    }
}
const authorSeed = async (db: any) => {
    const authors = db.collection("authors");
    try{
        const authorData = [
            {
                "username": "H.P. Lovecraft",
                "total_books": 4
            },
            {
                "username": "Jane Austen",
                "total_books": 2
            },
            {
                "username": "Thomas Erikson",
                "total_books": 8
            },
            {
                "username": "Harper Lee",
                "total_books": 8
            },
            {
                "username": "J.R.R. Tolkien",
                "total_books": 5
            },
            {
                "username": "William Shakespeare",
                "total_books": 3
            },
            {
                "username": "Charles Dickens",
                "total_books": 2
            },
            {
                "username": "Tony Morrison",
                "total_books": 1
            },
            {
                "username": "Johnny Sins",
                "total_books": 12
            }
        ];
        await authors.insertMany(authorData);
        console.log("Done seeding authors for mongo");
    }catch(err){
        logger.error(err);
    }
}
const resetDcuments = async (db: any) => {
    try{
        const users = db.collection("users");
        await users.deleteMany({});
        const books = db.collection("books");
        await books.deleteMany({});
        const authors = db.collection("authors");
        await authors.deleteMany({});
        console.log("Done resetting documents for mongo");
    }catch(err){
        logger.error("Error in reset of mongo Documents", err);
    }
}


export default seedData;