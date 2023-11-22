import express from "express";
import env from "dotenv";
import { Review, Book, Author, BookInteraction, UserData, FavoritedAuthor} from "../other_services/models/seqModels";
import jwt, { JwtPayload } from "jsonwebtoken";

env.config();

const router = express.Router();
router.use(express.json());

router.post("/user/:id/bookmarks", async (req, res) => {
    try {
        const userdata = jwt.verify(req.body.authToken, "secret") as JwtPayload;
        if(userdata.user.users_data_id != parseInt(req.params.id)) {
            res.status(401).send("You are not authorized to query for this user's bookmarks");
        }
        const result: any = await getBookmarks(parseInt(req.params.id));
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong while getting bookmarks");
    }
});

async function getBookmarks(user_id: number) {
    try {
        const bookmarks = await BookInteraction.findAll({ 
            where: { user_id: user_id, interaction_type: "Bookmarked" },
            include: [
                {
                  model: Book,
                  attributes: ['title']
                }
            ]
        });
        return bookmarks;
    } catch (error) {
        throw error; 
    }
}

router.post("/user/:id/borrowed", async (req, res) => {
    try {
        const userdata = jwt.verify(req.body.authToken, "secret") as JwtPayload;
        if(userdata.user.users_data_id != parseInt(req.params.id)) {
            res.status(401).send("You are not authorized to query for this user's borrowed books");
        }
        const result: any = await getBorrowed(parseInt(req.params.id));
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong while getting borrowed books");
    }
});

async function getBorrowed(user_id: number) {
    try {
        const borrowed = await BookInteraction.findAll({ 
            where: { user_id: user_id, interaction_type: "Borrowed" },
            include: [
                {
                  model: Book,
                  attributes: ['title']
                }
            ]
        });
        return borrowed;
    } catch (error) {
        throw error; 
    }
}

router.post("/user/:id/hasborrowed", async (req, res) => {
    try {
        const userdata = jwt.verify(req.body.authToken, "secret") as JwtPayload;
        if(userdata.user.users_data_id != parseInt(req.params.id)) {
            res.status(401).send("You are not authorized to query for this user's previously borrowed books");
        }
        const result: any = await getHasBorrowed(parseInt(req.params.id));
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong while getting previously borrowed books");
    }
});

async function getHasBorrowed(user_id: number) {
    try {
        const borrowed = await BookInteraction.findAll({ 
            where: { user_id: user_id, interaction_type: "Has_Borrowed" },
            include: [
                {
                  model: Book,
                  attributes: ['title']
                }
            ]
        });
        return borrowed;
    } catch (error) {
        throw error; 
    }
}

router.post("/user/:id/favoritedAuthors", async (req, res) => {
    try {
        const userdata = jwt.verify(req.body.authToken, "secret") as JwtPayload;
        if(userdata.user.users_data_id != parseInt(req.params.id)) {
            res.status(401).send("You are not authorized to query for this user's favorited authors");
        }
        const result: any = await getFavoritedAuthors(parseInt(req.params.id));
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong while getting requests");
    }
});

async function getFavoritedAuthors(user_id: number) {
    try {
        const favoritedAuthors = await FavoritedAuthor.findAll({  //FavoritedAuthor
            where: { user_id: user_id },
            include: [
                {
                  model: Author,
                  attributes: ['username']
                }
            ]
        });
        return favoritedAuthors;
    } catch (error) {
        throw error; 
    }
}

router.post("/user/:id/reviews", async (req, res) => {
    try {
        const userdata = jwt.verify(req.body.authToken, "secret") as JwtPayload;
        if (userdata.user.users_data_id != parseInt(req.params.id)) {
            res.status(401).send("You are not authorized to query for this user's reviews");
        }
        const result: any = await getReviews(parseInt(req.params.id));
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.status(401).send("Something went wrong while getting user reviews");
    }
});

async function getReviews(user_id: number) {
    try {
        const reviews = await Review.findAll({ 
            where: { user_id: user_id },
            include: [
                {
                  model: Book,
                  attributes: ['title']
                }
            ]
        });
        return reviews;
    } catch (error) {
        throw error; 
    }
}


export default router;