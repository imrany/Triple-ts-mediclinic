import x from 'sqlite3';
const sqlite3=x.verbose();

// Connecting Database
export const db = new sqlite3.Database("subscriptions.db" , (err) => {
    if(err){
        console.log("Error Occurred - " + err.message);
    }else{
        console.log("DataBase Connected");
    }
})

db.serialize(() => { 
    db.run(`CREATE TABLE IF NOT EXISTS subscriptions ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        endpoint TEXT NOT NULL, 
        keys_p256dh TEXT NOT NULL, 
        keys_auth TEXT NOT NULL, 
        role TEXT NOT NULL,
        email TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.log("Error creating table: " + err.message);
        } else {
            console.log("Table 'subscriptions' is ready.");
        }
    }); 
});
