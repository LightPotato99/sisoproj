const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err){
        console.error(err.message);
    }
    console.log('connected yay');
});

db.close((err) => {
    if (err){
        return console.error(err.message);
    }
    console.log('closed');
})
