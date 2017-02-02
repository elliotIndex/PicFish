module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : "PicFish",
      script    : "server/picfish-server.js",
      env: {
        NODE_ENV: "dev"
      },
      env_production : {
        NODE_ENV: "prod"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "elliot",
      host : "138.68.60.33",
      ref  : "origin/master",
      repo : "elliotaplant@github.com:PicFish.git",
      path : "/server/picfish-server",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production"
    },
    dev : {
      user : "node",
      host : "localhost:3000",
      ref  : "origin/master",
      repo : "elliotaplant@github.com:PicFish.git",
      path : "/server/picfish-server",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
}
