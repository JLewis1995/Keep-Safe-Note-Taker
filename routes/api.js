const router = require('express').Router();
const fs = require('fs');

// respond with JSON data from db.json when /notes api is called with GET
router.get('/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (error, data) => {
        if (error) throw error;
        res.json(JSON.parse(data));
    });
});

// read and post data to db.json when /notes api is called with POST
router.post('/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (error, data) => {
        if (error) throw error;
        let working = JSON.parse(data);
        working.push(req.body);

        fs.writeFile('./db/db.json', JSON.stringify(working), (error) => {
            if (error) return error;
        });
    });
    res.end();
})

module.exports = router;