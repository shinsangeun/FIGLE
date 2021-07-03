module.exports = {
  apps : [{
    name: 'FIGLE',
    script: 'npm',
    args: 'run serve',
    instances: 2,
    watch: '.',
    env: {
      NODE_ENV: "production",
      PORT: 5000
    },
    env_qa: {
      NODE_ENV: "qa"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
};
