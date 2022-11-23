const express = require("express");
const db = require("./db.js");

const app = express();

//middlewre (des fonction qu'on execute avant l'application marche)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;

app.get("/", function (req,res){
res.json({message:"api marche bien"});
});

//démarrer le serveur
app.listen(port, function (){
    console.log("l'application est demarré au port:${3000}");
});


  //Afficher la lister des article
app.get("/api/articles", (req, res) =>{
    const sql = "select * from article";
    //all c pour récuperer tous ces information
    db.all(sql, (err, rows) =>{
       if (err) {
           res.status(400).json({error: err.message});
           return;
       }
       res.json({message: "afficher la liste des articles", data:rows});
    });
});

//Affichez les détails d'un article
app.get("/api/articles/:id", (req, res) =>{
    const {id: articleID} = req.params
    const sql = "select * from article where id = ?";
    const params = [articleID];
    db.get(sql, params, (err, row) =>{
       if (err) {
           res.status(400).json({error: err.message});
           return;
       }
       res.json({message: "afficher les détails d'un article ${articleID}", data:row});
    });
});

 //Ajoutez un formulaire qui permet d'ajouter un article
 app.post("/api/articles", (req, res) => {
  const { titre,résumé,contenu,auteur,dateCreation,dateDerniéreMiseAJour } = req.body;
  //if l'utilisateur n'est pas renseigner sur tous ces information, il va retourner
  console.log(req.body)
  if (!titre || !résumé || !contenu || !auteur || !dateCreation || !dateDerniéreMiseAJour) {
    res.status(400).json({ error: "merci de remplir tous les champs!" });
    return;
  }
  const article = { titre,résumé,contenu,auteur,dateCreation,dateDerniéreMiseAJour };
  const sql = `INSERT into article(titre,résumé,contenu,auteur,dateCreation,dateDerniéreMiseAJour) VALUES (?,?,?,?,?,?)`;
  const params = [article.titre, article.résumé, article.contenu, article.auteur,article.dateCreation, article.dateDerniéreMiseAJour];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res
      .status(201)
      .json({ message: "article ajouter avec succée", data: article});
  });
});


//Ajoutez un formulaire qui permet de modifier un article
app.put("/api/articles/:id", (req, res) => {
  const {id: articleID} = req.params;
  const { titre,résumé,contenu,auteur,dateCreation,dateDerniéreMiseAJour } = req.body;

  if (!titre || !résumé || !contenu || !auteur || !dateCreation || !dateDerniéreMiseAJour) {
    res.status(400).json({ error: "merci de remplir tous les champs!" });
    return;
  }
  
const article = {titre,résumé,contenu,auteur,dateCreation,dateDerniéreMiseAJour  };
const sql = `update article set titre = ?, résumé = ?, contenu = ?, auteur = ?, dateCreation = ?, dateDerniéreMiseAJour = ? where id = ?`;
const params = [article.titre, article.résumé, article.contenu, article.auteur,article.dateCreation, article.dateDerniéreMiseAJour,articleID];
db.run(sql, params, function (err, result) {
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  res
    .status(201)
    .json({ message: "article ${articleID} modifier avec succée", data: article });
});
});

//supprimer un article
app.delete("/api/articles/:id", (req, res) =>{
  const { id: articleID } = req.params;
  const sql = "delete from article where id = ?";
  db.run(sql, articleID, function(err, resultat){
      if(err) {
          res.status(400).json({error: err.message});
          return;
      }
      res.json({message: `article ${articleID} supprimer`, data: this.changes});
  });
  });