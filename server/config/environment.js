console.log("ENV:", process.env.NODE_ENV);

devEnvironment = {
  mode: 'dev',
  domain: 'localhost:3000',
  mongoUrl: 'mongodb://localhost:27017/linksDb',
  port: 3000,
  noFetch: process.argv.indexOf('noFetch') > -1,
}

prodEnvironment = {
  mode: 'prod',
  domain: 'www.pic.fish',
  mongoUrl: 'mongodb://0.0.0.0:27017/linksDb',
  port: 8080,
  noFetch: false,
}

if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev') {
  console.log('Running in mode:', process.env.NODE_ENV);
} else {
  console.log('No environment providing, defaulting to prod');
}

module.exports = process.env.NODE_ENV === 'dev' ? devEnvironment : prodEnvironment;
