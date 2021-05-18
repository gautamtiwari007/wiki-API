const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view-engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleSchema);

//Request Targeting all Articles

app.route("/articles")

.get(function(req, res) {
        Article.find(function(err, foundArticles) {
            if (err) {
                console.log(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post(function(req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully added data to the DB");
            }
        });
    }).delete(function(req, res) {
        Article.deleteMany(function(err) {
            if (err) {
                res.send("All documents deleted from DB");
            } else {
                res.send(err);
            }
        });
    });

//Request Targeting a single Article

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles found!");
            }
        });
    })
    .put(function(req, res) {
        Article.update({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            }, { overwrite: true },
            function(err) {
                if (!err) {
                    res.send("Successfully Updated Article");
                }
            });
    })
    .patch(function(req, res) {
        Article.updateOne({ title: req.params.articleTitle }, { $set: req.body },
            function(err) {
                if (!err) {
                    res.send("Article updated via .patch");
                }
            }
        );
    })
    .delete(function(req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function(err) {
            if (!err) {
                res.send("Deleted the selected article");
            }
        });
    });


app.listen(3000, function() {

    console.log("Server started at port 3000");
});