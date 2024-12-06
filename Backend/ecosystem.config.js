module.exports = {
  apps: [{
    name: 'app',
    script: './app.local.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G'
  }]
};
