var config = {
  local: {
    mode: 'local',
    port: 3000,
    mongodb: {
      host: '127.0.0.1',
      port: 27017
    },
    weibo: {
      appKey: '1342570005',
      appSecret: '9c3460205c73bc41e32fbdf29b6b8b27'
    }
  },
  staging: {
    mode: 'staging',
    port: 4000,
    mongodb: {
      host: '127.0.0.1',
      port: 27017
    }
  },
  production: {
    mode: 'production',
    port: 3000,
    mongodb: {
      host: '127.0.0.1',
      port: 27017
    },
    weibo: {
      appKey: '4143213040',
      appSecret: '7b8a3f01e1fd2c16e80c881d9af9d0bc'
    }
  }
}
module.exports = function(mode) {
  return config[mode || process.argv[2] || 'local'] || config.local;
}