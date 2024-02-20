exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
};


exports.csrfGenerator = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.csrfError = (err, req, res, next) => {
  if(err && 'EBADCSRFTOKEN' === err.code) {
    return res.render('404');
  }
};

exports.loginRequired= (req, res, next) => {
  if(!req.session.user) {
    req.flash('errors', 'Você precisa fazer login');
    req.session.save(() => {res.redirect('/')});
    return;
  }

  next();
};

