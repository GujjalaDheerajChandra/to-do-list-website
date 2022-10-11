const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
app.get('/',(req,res)=>{

    const today = new Date();
   
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };
    let day = today.toLocaleDateString('en-US', options);
    res.render("list" , {listTitle: day, newListItems: items})
})

app.post('/', (req,res)=>{
    let item = req.body.newItem;
    if(req.body.list === 'work'){
        workItems.push(item);
        res.redirect('/work');
    } else{
        items.push(item);
        res.redirect('/');
    }
    
})

app.get('/work', (req,res)=>{
    res.render('list', {listTitle: "work", newListItems: workItems})
})

app.post('/work', (req,res)=>{
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect('/work');
})
app.get('/about',(req,res)=>{
    res.render("about");
})
app.listen(3000,()=>{
    console.log("server started at port 3000");
})