require.config({

  deps: ['apirn'],

  baseUrl: '/static/js',

  paths: {

    'jquery': 'libs/jquery.min',
    'bootstrap': 'libs/bootstrap.min',
    'underscore': 'libs/underscore-min',
    'backbone': 'libs/backbone-min',
    'apirn': 'libs/apirn'

  },

  shim: {

    bootstrap: {
      deps: ['jquery'],
    },
    
    backbone: {
      deps: ['jquery', 'underscore'],
    },

    apirn: {
      deps: ['backbone', 'bootstrap']
    }

  },

  waitSeconds: 0

});
