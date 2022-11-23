const sqlite3 = require("sqlite3").verbose();

const dbFile = "db.sqlite3";

//se connecter avec la base de données
let db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("connexion à la base sqlite3...");
    //run c pour inter agir avec la base de donnée
    const sql = `create table article (
            id integer primary key autoincrement,
            titre text,
            résumé text,
            contenu text,
            auteur text,
            dateCreation text,
            dateDerniéreMiseAJour text
            )`;
    db.run(sql, (err) => {
      if (err) {
        console.log("table déja crée");
      }
    });
  }
  
});

module.exports = db;
