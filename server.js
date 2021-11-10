// dependencies
require("dotenv").config();
const { PORT = 3000, DATABASE_URL } = process.env;
const express = require("express");
const mongoose = require("mongoose");
//middleware
const cors = require("cors");
const morgan = require("morgan");

//app object
const app = express();
//database connection
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

//conection events
mongoose.connection
  .on("open", () => console.log("you are connected to mongo"))
  .on("close", () => console.log("you are disconnected from mongo"))
  .on("error", (error) => console.log(error));

// model/schema
const CheeseSchema = new mongoose.Schema({
  name: String,
  countryOfOrigin: String,
  image: String,
});
const Cheese = mongoose.model("Cheese", CheeseSchema);

//setting up middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
///////////////
// routes
//////////////
app.get("/", (req, res) => {
  res.send("hello world");
});

//index route
app.get("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.find({}));
  } catch (error) {
    res.status(400).json({ error });
  }
});
// create route
app.post("/cheese", async (req, res) => {
  try {
    res.json(await Cheese.create(req.body));
  } catch (error) {
    res.status(400).json({ error });
  }
});
//update route
app.put("/cheese/:id", async (req, res) => {
  try {
    res.json(
      await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    res.status(400).json({ error });
  }
});

//delete route
app.delete("/cheese/:id", async (req, res) => {
  try {
    res.json(await Cheese.findByIdAndRemove(req.params.id));
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
