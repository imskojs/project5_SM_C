(function() {
  'use strict';

  angular.module('app')
    .config(routes);

  routes.$inject = ['$stateProvider', '$httpProvider'];

  function routes($stateProvider, $httpProvider) {

    // $httpProvider.interceptors.push('AuthInterceptor');

    $stateProvider

    .state('main', {
      url: '/main',
      templateUrl: 'state/00main/main.html',
      controller: 'MainController as Main'
    })
      .state('main.home', {
        url: '/home',
        views: {
          main: {
            templateUrl: 'state/01home/home.html',
            controller: 'HomeController as Home'
          }
        }
      })

  }
})();
