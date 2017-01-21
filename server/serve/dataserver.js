const globals = require('../globals');
const fileServer = require('./fileServer');
const database = require('../database/database');

module.exports = {
  serveRequest: (res, index, category) => {
    index = parseInt(index);
    if (isNaN(index) || index < 2) {
      res.send([])
    } else {
      database.getBatch(index - 1, category)
      .then(links => {
        res.send(links);
      })
    }
  },
}
