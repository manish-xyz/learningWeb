//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { redirect } = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const defaultItem = ({
  name: "Welcome to your list!",
})

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", (req, res) => {

  Item.find({}, (err, result) => {


    res.render("list", { listTitle: "Today", newListItems: result });

  });
});

app.post("/", async function (req, res) {

  const itemName = req.body.newItem;
  const listName = _.toLower(req.body.list);
  try {
    const item = new Item({ name: itemName });
    if (listName === "today") {
      if (itemName.length > 0) {
        item.save();
        res.redirect("/");
      }
      else {
        res.redirect("/");
      }
    } else {
      const list = await List.findOne({ name: listName })

      if (itemName.length > 0) {
        list.items.push(item)
        await list.save()
        res.redirect("/" + listName);
      }
      else {
        res.redirect("/" + listName);
      }
    }
  } catch (err) {
    if (err instanceof mongoose.Error) {
      res.status(500).json({ message: "error with Db" })
    }
    res.status(500).json({ message: "something went wrong" })
  }
});



app.post("/completed", (req, res) => {
  const listName = _.toLower(req.body.listTitle);
  if (listName === "today") {
    Item.findByIdAndRemove(req.body.completed, (err) => {
      if (err) { console.log(err); }
      res.redirect("/");
    })
  }
  else {
    console.log(List)
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id:req.body.completed}}}, (err, list) => {
      if (!err){
        res.redirect("/" + listName)
      }
    })
  }

});



app.get("/:ownList", (req, res) => {
  const ownList = _.toLower(req.params.ownList);
  List.findOne({ name: ownList }, (err, list) => {
    if (!err) {
      if (!list) {
        const list = new List({
          name: ownList,
          // items: defaultItem
        });
        list.save();
        res.redirect("/" + ownList);
      } else {
        res.render("list", { listTitle: _.upperFirst(ownList), newListItems: list.items });
      }
    }
  })
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
