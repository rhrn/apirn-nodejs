var web = require('./web.js'),
  port = process.env.PORT || 3000;

web.listen(port, function () {
  console.log('Listening on port ', port);
});
