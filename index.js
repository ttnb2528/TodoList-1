import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Tan281201!",
  port: 5432,
});

db.connect();

let items = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY title ASC");
    items = result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try {
    db.query("INSERT INTO items (title) VALUES ($1)", [item])
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const newItem = req.body.updatedItemTitle;
  const idUpdated = req.body.updatedItemId;
  console.log(newItem);
  console.log(idUpdated);
  try {
    await db.query("UPDATE items SET title = ($1) WHERE id= ($2)", [newItem, idUpdated]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }

});

app.post("/delete", async (req, res) => {
  const idDeleted = req.body.deleteItemId;
  console.log(idDeleted);

  try {
    await db.query("DELETE FROM items WHERE id= ($1)", [idDeleted]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
