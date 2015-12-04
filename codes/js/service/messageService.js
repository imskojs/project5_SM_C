(function() {
  'use strict';
  angular.module('app')
    .factory('Message', Message);

  Message.$inject = ['$ionicLoading', '$ionicPopup'];

  function Message($ionicLoading, $ionicPopup) {
    var service = {
      loading: loadingDefault,
      hide: loadingHide,
      success: messageSuccess,
      error: messageError,
      alert: popUpAlertDefault
    };

    return service;

    function loadingDefault(message) {
      $ionicLoading.show(message);
    }

    function loadingHide() {
      $ionicLoading.hide();
    }

    function messageSuccess(message) {
      $ionicLoading.show({
        template: '<h4 class="message-success">' + message + '</h4>',
        duration: 2000
      });
    }

    function messageError(message) {
      $ionicLoading.show({
        template: '<h4 class="message-error">' + message + '</h4>',
        duration: 2000
      });
    }


    function popUpAlertDefault(title, message) {
      loadingHide();
      return $ionicPopup.alert({
        title: title || '인터넷이 끊겼습니다.',
        template: message || '인터넷을 켜주세요.'
      });
    }


  }


})();
