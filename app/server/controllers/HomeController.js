var userHelper = require('../helpers/userHelper');

function renderHomePage(req, res, next) {
  res.render('index', {
    message: req.flash('info'),
    currentUser: userHelper.getCurrentUser(req)
  });
}

module.exports.renderHomePage = renderHomePage;
