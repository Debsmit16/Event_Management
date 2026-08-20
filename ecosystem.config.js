module.exports = {
  apps: [
    {
      name: "event-backend",
      script: "npm",
      args: "run start",
      cwd: "./backend",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "event-frontend",
      script: "npm",
      args: "run start",
      cwd: "./frontend",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
