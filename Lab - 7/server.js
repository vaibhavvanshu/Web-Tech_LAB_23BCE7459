const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB, getDB } = require("./database");
const { ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

connectDB();


// ADD NOTE
app.post("/notes", async (req, res) => {

    const db = getDB();

    const note = {
        title: req.body.title,
        subject: req.body.subject,
        description: req.body.description,
        created_date: new Date()
    };

    await db.collection("notes").insertOne(note);

    res.send({ message: "Note Added" });
});


// GET NOTES
app.get("/notes", async (req, res) => {

    const db = getDB();

    const notes = await db.collection("notes").find().toArray();

    res.json(notes);
});


// UPDATE NOTE
app.put("/notes/:id", async (req, res) => {

    const db = getDB();

    await db.collection("notes").updateOne(
        { _id: new ObjectId(req.params.id) },
        {
            $set: {
                title: req.body.title,
                description: req.body.description
            }
        }
    );

    res.send({ message: "Note Updated" });
});


// DELETE NOTE
app.delete("/notes/:id", async (req, res) => {

    const db = getDB();

    await db.collection("notes").deleteOne(
        { _id: new ObjectId(req.params.id) }
    );

    res.send({ message: "Note Deleted" });
});


// SEARCH BOOK
app.get("/books/search", async (req, res) => {

    const db = getDB();

    const title = req.query.title;

    const books = await db.collection("books")
        .find({ title: { $regex: title, $options: "i" } })
        .toArray();

    res.json(books);
});


// FILTER CATEGORY
app.get("/books/category/:category", async (req, res) => {

    const db = getDB();

    const books = await db.collection("books")
        .find({ category: req.params.category })
        .toArray();

    res.json(books);
});


// SORT BY PRICE
app.get("/books/sort", async (req, res) => {

    const db = getDB();

    const books = await db.collection("books")
        .find()
        .sort({ price: 1 })
        .toArray();

    res.json(books);
});


// TOP RATED BOOKS
app.get("/books/top", async (req, res) => {

    const db = getDB();

    const books = await db.collection("books")
        .find({ rating: { $gte: 4 } })
        .limit(5)
        .toArray();

    res.json(books);
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});