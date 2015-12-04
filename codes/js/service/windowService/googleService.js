(function() {
  'use strict';

  angular.module('app')
    .factory('google', google);

  google.$inject = ['$window'];

  function google($window) {

    return $window.google;
  }
})();
