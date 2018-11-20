var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var mongoose = require('mongoose');
var product = require('./product');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8090;
var router = express.Router();


//connect to db called STORE
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/STORE";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("STORE");
  //Create a collection name "MOVIE":
  dbo.createCollection("MOVIE", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});


router.use(function (req, res, next) {
    // do logging
    // do authentication
    console.log('Logging of request will be done here');
    next();
});


//enter new movie
router.route('/products').post(function (req, res) {
    var p = new product();
    p.title = req.body.title;
    p.genre = req.body.genre;
    p.year = req.body.year;
    p.language = req.body.language;
    p.length = req.body.length;



    p.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.send({ message: 'Product Created !' })
    })
});


//find all movies
router.route('/products').get(function (req, res) {
    product.find(function (err, products) {
        if (err) {
            res.send(err);
        }
        res.send(products);
    });
});



//find movie by id
router.route('/products/:product_id').get(function (req, res) {

    product.findById(req.params.product_id, function (err, prod) {
        if (err)
            res.send(err);
        res.json(prod);
    });
});


// update all fields of movie
router.route('/products/:product_id').put(function (req, res) {

    product.findById(req.params.product_id, function (err, prod) {
        if (err) {
            res.send(err);
        }
        p.title = req.body.title;
        p.genre = req.body.genre;
        p.year = req.body.year;
        p.language = req.body.language;
        p.length = req.body.length;
        prod.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product updated!' });
        });

    });
});


//update release year of movie
router.route('/products/:product_id/year').put(function (req, res) {

    product.findById(req.params.product_id, function (err, prod) {
        if (err) {
            res.send(err);
        }

        p.year = req.body.year;

        prod.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Product year updated!' });
        });

    });
});


//delete particular movie
router.route('/products/:product_id').delete(function (req, res) {

    product.remove({ _id: req.param.product_id }, function (err, prod) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    })

});

//delete emtire collection contents
router.route('/products/collection').delete(function (req, res) {

    db.MOVIE.remove( { } );

});



app.use(cors());
app.use('/api', router);
app.listen(port);
console.log('REST API is runnning at ' + port);
