function renderHomePage(req, res, next) {
  res.render('index', {
    isLoggedIn: req.isAuthenticated()
  });
}

module.exports.renderHomePage = renderHomePage;
