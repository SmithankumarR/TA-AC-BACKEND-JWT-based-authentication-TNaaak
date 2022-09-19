var express = require('express');
var auth = require('../middleware/auth');
var Article = require('../models/Article');
var Comment = require('../models/Comment');
var User = require('../models/User');
var router = express.Router();

// create new article

router.post('/', auth.isLoggedIn, async function (req, res, next) {
  var data = req.body;
  data.author = req.user;

  var createdArticle = await Article.create(data);
  var updatedUser = await User.findOneAndUpdate(
    { username: createdArticle.author.username },
    { $push: { articles: createdArticle.id } }
  );

  res.json({ article: createdArticle });
});

// get articles
router.get('/:slug', auth.isLoggedIn, async function (req, res, next) {
  var slug = req.params.slug;
  let article = await Article.findOne({ slug });

  res.json({ article: article });
});

// update articles
router.put('/:slug', auth.isLoggedIn, async function (req, res, next) {
  var slug = req.params.slug;
  var data = req.body;

  var article = await Article.findOneAndUpdate({ slug }, data);
  res.json({ article: article });
});

// delete article
router.delete('/:slug', auth.isLoggedIn, async function (req, res, next) {
  var slug = req.params.slug;
  var article = await Article.findOneAndDelete({ slug });

  var updatedUser = await User.findOneAndUpdate(
    { username: article.author.username },
    { $push: { articles: article.id } }
  );
  
  res.json({ article: article });
});

// create comment
router.post(
  '/:slug/comments',
  auth.isLoggedIn,
  async function (req, res, next) {
    var slug = req.params.slug;
    var data = req.body;
    data.author = req.user;
    var article = await Article.findOne({ slug });
    data.article = article.id;

    var comment = await Comment.create(data);
    var loggedUser = await User.findOne({ username: req.user.username });

    var updatedUser = await User.findByIdAndUpdate(loggedUser.id, {
      $push: { comments: comment.id },
    });
    var updatedArticle = await Article.findByIdAndUpdate(article.id, {
      $push: { comments: comment.id },
    });
    res.json({ comment });
  }
);

// list comment on article
router.get('/:slug/comments', auth.isLoggedIn, async function (req, res, next) {
  var slug = req.params.slug;
  var article = await Article.findOne({ slug }).populate('comments');
  res.json({ comments: article.comments });
});

// delete comments
router.delete(
  ':/slug/comments/:id',
  auth.isLoggedIn,
  async (req, res, next) => {
    var slug = req.params.slug;
    var commentId = req.params.id;

    var deletedComment = await Comment.findByIdAndDelete(commentId);

    var updatedUser = await User.findOneAndUpdate(
      { username: deletedComment.author.username },
      { $pull: { comments: deletedComment.id } }
    );

    var updatedArticle = await Article.findOneAndUpdate(
      { slug },
      { $pull: { comments: deletedComment.id } }
    );
    res.json({ user: updatedUser });
  }
);

module.exports = router;