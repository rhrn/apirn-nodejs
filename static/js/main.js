require.config({

  deps: ['apirn'],

  baseUrl: '/static/js',

  paths: {

    'jquery': 'libs/jquery.min',
    'underscore': 'libs/underscore-min',
    'backbone': 'libs/backbone-min',
    'apirn': 'libs/apirn'

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
