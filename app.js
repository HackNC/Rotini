const express = require('express');
const app = express();
const PORT = process.env.PORT || 4201;

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

app.use(express.json()); 

app.get('/createDB',(req,res)=>{
    db.serialize(function() {
      db.run("create table if not exists lorem (info text,description)");
      });
      
      db.close();
    res.send({kq:"hello world"})
})

app.get('/', (req, res) => { 
    db.serialize(function() {
      
        var stmt = db.prepare("INSERT INTO lorem VALUES (?,?)");
        for (var i = 0; i < 10; i++) {
            stmt.run(["Ipsum "+ i,"description"]);
        }
        stmt.finalize();
      
        db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
            console.log(row.id + ": " + row.info);
        });
      });
      
      db.close();
    res.send({kq: 1})
 });

app.listen(PORT, () => {
    console.log(`this is port ${PORT}`)
})
