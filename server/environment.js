devEnvironment = {
  mode: "dev",
  domain: "localhost:3000",
  port: 3000,
}

prodEnvironment = {
  mode: "prod",
  domain: "www.pic.fish",
  port: 3000,
}

console.log("Running in mode:", process.env.NODE_ENV);

module.exports = process.env.NODE_ENV === "prod" ? prodEnvironment : devEnvironment;
