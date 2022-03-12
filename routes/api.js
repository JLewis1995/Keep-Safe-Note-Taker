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
});

router.delete('/notes/:id', (req, res) => {
    // get id from passed in data
    const tobe = req.params.id;
    fs.readFile('./db/db.json', 'utf-8', (error, data) => {
        if (error) throw error;
        let working = JSON.parse(data);
        // cycle through list of note ids to see if any match - if so splice
        for (let i = 0; i < working.length; i++) {
            if (tobe == working[i].id) {
                working.splice(i,1);
                fs.writeFile('./db/db.json', JSON.stringify(working), (error) => {
                    if (error) throw error;
                });
            };
            
        };
    });
    res.end();
});

module.exports = router;