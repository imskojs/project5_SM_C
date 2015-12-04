(function() {
  'use strict';
  angular.module('app')
    .controller('MessageListController', MessageListController);

  MessageListController.$inject = ['MessageListModel', '$scope', 'Messages', 'Message'];

  function MessageListController(MessageListModel, $scope, Messages, Message) {

    var MessageList = this;
    MessageList.Model = MessageListModel;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function onBeforeEnter() {
      Message.loading();
      Messages.getMyInboxSenderList({

      }).$promise
        .then(function success(messagesWrapper) {
          Message.hide();
          MessageListModel.messages = messagesWrapper.senders;
          console.log("---------- messa ----------");
          console.log(messagesWrapper);
          console.log("HAS TYPE: " + typeof messa);
          console.log("---------- CONSOLE END -------------------");
        })
        .catch(function error(err) {
          Message.hide();
          console.log("---------- err ----------");
          console.log(err);
          console.log("HAS TYPE: " + typeof err);
          console.log("---------- CONSOLE END -------------------");
        });
    }
  }
})();
