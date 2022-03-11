const router = require('express').Router();
const fs = require('fs');

router.get('/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', function(error, data) {
        if (error) throw error;
        res.json(JSON.parse(data));
    });
});

router.post('/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (error, data) => {
        if (error) throw error;
        let working = JSON.parse(data);
        working.push(req.body);

        fs.writeFile('./db/db.json', JSON.stringify(working), function(error) {
            if (error) return error;
        });
    });
    res.end();
})

module.exports = router;