(function() {
  'use strict';
  angular.module('app')
    .controller('MessageDetailController', MessageDetailController);

  MessageDetailController.$inject = ['MessageDetailModel', '$scope', 'Messages', '$stateParams', 'Message', '$state'];

  function MessageDetailController(MessageDetailModel, $scope, Messages, $stateParams, Message, $state) {

    var MessageDetail = this;
    MessageDetail.Model = MessageDetailModel;

    MessageDetail.postMessage = postMessage;
    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function onBeforeEnter() {
      console.log($stateParams.from);
      Messages.readMessagesFrom({
        from: $stateParams.from
      }).$promise
        .then(function success(messagesWrapper) {
          MessageDetail.newMessage = null;
          MessageDetailModel.messages = messagesWrapper.messages;
          console.log("---------- messagesWrapper ----------");
          console.log(messagesWrapper);
          console.log("HAS TYPE: " + typeof messagesWrapper);
          console.log("---------- CONSOLE END -------------------");
        })
        .catch(function error(err) {
          console.log("---------- err ----------");
          console.log(err);
          console.log("HAS TYPE: " + typeof err);
          console.log("---------- CONSOLE END -------------------");

        });
    }

    function postMessage() {
      var message = MessageDetail.newMessage;
      Message.loading();
      Messages.sendMessage({}, {
        message: message,
        to: $stateParams.from
      }).$promise
        .then(function success(message) {
          console.log(message);
          $state.reload();
          Message.hide();
        })
        .catch(function error(err) {
          console.log(err);
          Message.hide();
        });
    }
  }
})();
