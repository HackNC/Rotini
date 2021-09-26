const express = require('express');
const app = express();
const PORT = process.env.PORT || 4201;

app.use(express.json()); 

app.use(express.urlencoded({extended: true}))

const services = require('./services')
app.use(services)

const formHandler = require('./submissions_handler')
app.use(formHandler)

app.get('/form', (req, res) => {
    res.sendFile(__dirname + "/form.html")
})

// app.get('/', (req, res) => { 
    // db.serialize(function() {
      
    //     var stmt = db.prepare("INSERT INTO lorem VALUES (?,?)");
    //     for (var i = 0; i < 10; i++) {
    //         stmt.run(["Ipsum "+ i,"description"]);
    //     }
    //     stmt.finalize();
      
    //     db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    //         console.log(row.id + ": " + row.info);
    //     });
    //   });
      
    //   db.close();
//     res.send("Nothing's here")
//  });

app.listen(PORT, () => {
    console.log(`Listening to localhost:${PORT}`)
})
