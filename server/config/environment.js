devEnvironment = {
  mode: 'dev',
  domain: 'localhost:80',
  mongoUrl: 'mongodb://localhost:27017/linksDb',
  port: 80,
  noFetch: process.argv.indexOf('noFetch') > -1,
}

prodEnvironment = {
  mode: 'prod',
  domain: 'www.pic.fish',
  mongoUrl: 'mongodb://0.0.0.0:27017/linksDb',
  port: 80,
  noFetch: false,
}

console.log('Running in mode:', process.env.NODE_ENV);

module.exports = process.env.NODE_ENV === 'prod' ? prodEnvironment : devEnvironment;
