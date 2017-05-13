var express = require('express');
var router = express.Router();
var request = require('request');
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');
var mongoose = require('mongoose');
var cheerio = require('cheerio');


mongoose.connect('mongodb://localhost/scraper_one');
var db = mongoose.connection;

db.once('open', function() {
    console.log('Mongoose connection successful.');
});

router.get('/', function(req, res) {
    request('https://news.ycombinator.com/', function(error, response, html) {
        var $ = cheerio.load(html);
        $('td.title').each(function(i, element) {

            var result = {};

            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            var entry = new Article(result);

            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(doc);
                }
            });


        });
    });
    Article.find({},function(err,data) {
         res.render('home');
     });
});

router.get('/scrape', function(req, res) {
});

router.get('/articles', function(req, res) {
    Article.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(doc);
        }
    });
});
router.get('/articles/:id', function(req, res) {
    Article.findOne({ '_id': req.params.id })
        .populate('note')
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(doc);
            }
        });
});

router.post('/deletenote/:id', function(req, res) {
    console.log(req.params.id);
    Note.findOne({ '_id': req.params.id })
        .remove('note')
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(doc);
            }
        });
});


router.post('/articles/:id', function(req, res) {
    var newNote = new Note(req.body);

    newNote.save(function(err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            Article.findOneAndUpdate({ '_id': req.params.id }, { 'note': doc._id })
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(doc);
                    }
                });
        }
    });
});

module.exports = router;
