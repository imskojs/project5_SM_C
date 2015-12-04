(function() {
  'use strict';

  angular.module('app')
    .factory('MessageDetailModel', MessageDetailModel);

  MessageDetailModel.$inject = [];

  function MessageDetailModel() {

    var model = {
      messages: []
    };
    return model;
  }
})();
