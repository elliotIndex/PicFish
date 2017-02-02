

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
  mongoUrl: process.env.MONGODB_URI,
  port: 3000,
  noFetch: false,
}

if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'dev') {
  console.log('Running in mode:', process.env.NODE_ENV);
} else {
  console.log('No environment providing, defaulting to prod');
}

module.exports = process.env.NODE_ENV === 'dev' ? devEnvironment : prodEnvironment;
