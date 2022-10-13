const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const Item = mongoose.model('item', itemsSchema);

const item1 = new Item({
    name: "Welcome to todo list",
})
const item2 = new Item({
    name: "press + button to add new item"
})
const item3 = new Item({
    name: "<-- hit this to erase item"
})
const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = new mongoose.model('list', listSchema);

app.get('/', (req, res) => {

    Item.find({}, (err, docs) => {
        if (docs.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("data inserted to model sucessfully");
                }
                res.redirect('/');
            });
        } else {
            if (err) {
                console.log(err);
            } else {
                res.render("list", { listTitle: "Today", newListItems: docs })
            }
        }
    })
})

app.post('/', (req, res) => {
    let listItem = req.body.newItem;
    let listName = req.body.list;
    const listDoc = new Item({
        name: listItem,
    });
    if (listName === "Today") {
        listDoc.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName},(err,foundList)=>{
            if(!err){
                foundList.items.push(listDoc);
                foundList.save();
                res.redirect("/"+ listName);
            }
        })
    }

})

app.post('/delete', (req, res) => {
    const checkItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === 'Today'){
        Item.findByIdAndRemove( checkItemId , (err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/");
                console.log("deleted item successfully from toay list");
            }
        })
    }else{
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkItemId}}},(err,foundList)=>{
            if(!err){
                res.redirect('/'+listName);
            }
        })
    }
    

})

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName }, (err, foundList) => {
        if (err) {
            console.log(err);
        } else {
            if (!foundList) {
                //create new list

                const list = new List({
                    name: customListName,
                    items: defaultItems
                })

                list.save();
                res.redirect('/' + customListName);
            } else {
                //show existing list
                res.render('list', { listTitle: foundList.name, newListItems: foundList.items })
            }
        }
    })




})



app.listen(3000, () => {
    console.log("server started at port 3000");
})
