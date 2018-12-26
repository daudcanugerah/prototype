
class Dashboard {
  index() { //eslint-disable-line
    return async (req, res) => {
      res.render('dashboard/index.ejs', { linkTarget: 'dashboard' });
    };
  }
}

module.exports = new Dashboard();
