devEnvironment = {
  mode: "dev",
  domain: "localhost:3000",
  mongoUrl: 'mongodb://localhost:27017/linksDb',
  port: 3000,
}

prodEnvironment = {
  mode: "prod",
  domain: "www.pic.fish",
  mongoUrl: 'mongodb://0.0.0.0:27017/linksDb',
  port: 3000,
}

console.log("Running in mode:", process.env.NODE_ENV);

module.exports = process.env.NODE_ENV === "prod" ? prodEnvironment : devEnvironment;
