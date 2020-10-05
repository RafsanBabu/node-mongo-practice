const express = require('express');
const bodyParser=require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const uri = "mongodb+srv://organicUser:yeRCH2Qm7aA6haP@cluster0.tg9pc.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/',(req,res) =>{
    res.sendFile(__dirname+'/index.html');
})




client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
  
  app.get("/products",(req,res)=>{
    productCollection.find({}).toArray((err,documents)=>{
        res.send(documents);
    })
  })

  app.post("/addProduct",(req,res)=>{
      const product = req.body;
      //console.log(product);
      productCollection.insertOne(product)
      .then(result =>{
          //console.log("successfull");
          //res.send("success");
          res.redirect('/')
      })
  })

  app.delete("/delete/:id",(req,res)=>{
      console.log(req.params.id);
      productCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then((result)=>{
         // console.log(result);
         res.send(result.deletedCount>0)

      })
  })
  
});



app.listen(3000);