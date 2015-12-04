(function() {
  'use strict';

  angular.module('app')
    .factory('MessageListModel', MessageListModel);

  MessageListModel.$inject = [];

  function MessageListModel() {

    var model = {
      messages: [
        // {
        //   id: '',
        //   createdAt:'',
        //   from:'',
        //   message:'',
        //   createdBy: '',
        //   read: ''
        // }
      ]
    };
    return model;
  }
})();
