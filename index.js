var express=require('express');
const {User}= require('./models')
const  {Adresse}  = require('./models');
const cors=require("cors")
const bodyParser=require("body-parser")
const axios = require("axios")
//const {Sequelize}=require('sequelize');
//instantiate server
var server=express();
//server.use(express.json());
server.use(
    cors({
        origin:"http://localhost:3000",
    })
)
.use(bodyParser.urlencoded({extended:false}))
.use(bodyParser.json())
//launch server
server.listen(8080,function(){
    console.log('Serveur lancé')
})
//routes
server.get('/',function(req,res){
res.setHeader('Content-type','text/html');
res.send('<h1>Bonjour tout le monde !!!</h1>');
});
//Read all users
/*server.get('/allusers',function (req,res){
 //done by achraf :
 const users=await User.findAll();
  res.status(200).json(users)
  res.end();
});*/
//second solution:
server.get("/allusers", (req,res) => {
  User.findAll()
  .then((User)=> {
      res.send(User);
  })
  .catch((err) =>{
      console.log(err);
  });
  //res.send("succes");
});
//read all user's adresses
server.get("/alladresses", async (req,res) => {
    Adresse.findAll()
    .then((Adresse)=> {
        res.send(Adresse);
    })
    .catch((err) =>{
        console.log(err);
    });
  });
  //done by achraf :
 /*const adresses=await Adresse.findAll();
 res.status(200).json(adresses);
 res.end();
});*/
//ajouter des utilisateurs à la base de données
server.post("/adduser", (req, res) => {
    const {body} = req ;
    var U

    User.create({
        name : body.name,
        username : body.username,
        email : body.mail,
        phone: body.phone,
        website: body.website,
        company_name: body.cname,
    }).then((User)=> {
        
        U = User.id
        Adresse.create({
            UserId : U,
            home_adress1 : body.adress,
            home_adress2 : body.adress1,
            work_adress : body.workadress,
        }).catch((err) => {
            if (err) {
                console.log("erreur : "+err);
            }
        });
    })
    .catch((err) => {
        if (err) {
            console.log("erreur : "+err);
        }
    });
    

    res.send("end insert");
});
//Delete a User
server.delete("/delete/:id", (req, res) =>{
    Adresse.destroy({where : {UserId : req.params.id} }).then(User.destroy({where : {id : req.params.id} }));
  
})