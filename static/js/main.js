require.config({

  deps: ['apirn'],

  baseUrl: '/static/js',

  paths: {

    'apirn': 'libs/apirn',
    'jquery': 'libs/jquery.min',
    'underscore': 'libs/underscore-min',
    'backbone': 'libs/backbone-min',

  },

  shim: {
    
    backbone: {
      deps: ['jquery', 'underscore'],
    },

    apirn: {
      deps: ['backbone']
    }

  },

  waitSeconds: 0

});
