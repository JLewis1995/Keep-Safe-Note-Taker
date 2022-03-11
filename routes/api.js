const router = require('express').Router();
const fs = require('fs');

router.get('/notes', function(req, res) {
    fs.readFile('./db/db.json', 'utf8', function(error, data) {
        if (error) throw error;
        res.json(JSON.parse(data));
    });
});

// router.post

module.exports = router;