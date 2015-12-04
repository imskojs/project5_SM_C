(function() {
  'use strict';
  angular.module('app')
    .controller('MainController', MainController);

  MainController.$inject = ['MainModel', '$ionicModal', '$scope', 'appStorage', '$ionicSideMenuDelegate', '$state', '$timeout'];

  function MainController(MainModel, $ionicModal, $scope, appStorage, $ionicSideMenuDelegate,
    $state, $timeout) {

    var Main = this;
    Main.Model = MainModel;

    Main.setAlarm = setAlarm;
    Main.logout = logout;


    $ionicModal.fromTemplateUrl('state/modal/requestEditProfile.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      Main.profileModal = modal;
    });
    $ionicModal.fromTemplateUrl('state/modal/requestAccountTermination.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      Main.terminationModal = modal;
    });
    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function setAlarm(bool) {
      if (bool) {
        console.log('set alarm on');
        appStorage.alarm = true;
        MainModel.alarmOn = appStorage.alarm;
      } else {
        console.log('set alarm off');
        appStorage.alarm = false;
        MainModel.alarmOn = appStorage.alarm;
      }
    }

    function logout() {
      appStorage.token = null;
      appStorage.user = {};
      $ionicSideMenuDelegate.toggleLeft(false);
      $state.go('main.home');
    }
  }
})();
