function renderHomePage(req, res, next) {
  res.render('index', {
    isLoggedIn: req.isAuthenticated(),
    message: req.flash('info'),
    username: req.session.username
  });
}

module.exports.renderHomePage = renderHomePage;
