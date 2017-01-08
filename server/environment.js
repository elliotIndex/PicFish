devEnvironment = {
  mode: "dev",
  domain: "localhost",
  port: 3000,
}

prodEnvironment = {
  mode: "prod",
  domain: "www.listoftheday.fish",
  port: 3000,
}

module.exports = process.env.prod ? prodEnvironment : devEnvironment;
