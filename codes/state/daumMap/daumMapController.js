(function() {
  'use strict';

  angular.module('app')
    .controller('DaumMapController', DaumMapController);

  DaumMapController.$inject = ['DaumMapModel', '$ionicModal', '$scope', '$state', '$stateParams', '$timeout', 'Message'];

  function DaumMapController(DaumMapModel, $ionicModal, $scope, $state, $stateParams, $timeout, Message) {

    var Map = this;
    Map.Model = DaumMapModel;

    Map.searchType = "address";



    Map.findMeThenSearchNearBy = DaumMapModel.findMeThenSearchNearBy;

    $scope.$on('$ionicView.afterEnter', onAfterEnter);

    function onAfterEnter() {}
    Map.searchLocationNearBy = function(value) {
      console.log("---------- value ----------");
      console.log(value);
      console.log("HAS TYPE: " + typeof value);
      console.log("---------- CONSOLE END -------------------");

      DaumMapModel.searchLocationNearBy(value);
    };

    Map.goToDetailHandler = function(state, params) {
      Message.loading();
      DaumMapModel.modal.hide();
      $state.go(state, {
        type: 'local',
        id: DaumMapModel.selectedPlace.id,
        prev: params.prev
      });
    };

    Map.goToHandler = function(state, params) {
      $state.go(state, params);
    };
    Map.hasStateParams = function(paramName) {
      return !!$stateParams[paramName];
    };


    // Make currently selected place from DaumMapDirective available at ModalView
    Map.selectedPlace = DaumMapModel.selectedPlace;

    $scope.$on('$ionicView.enter', function() {
      // Set Modal
      $ionicModal.fromTemplateUrl('state/daumMap/placeModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
        .then(function(modal) {
          DaumMapModel.modal = modal;
        });
      DaumMapModel.domMap.relayout();
      if ($stateParams.id) {
        DaumMapModel.findPlaceByIdThenDrawAPlace($stateParams.id);
      }
    });

    $scope.$on('$ionicView.afterEnter', function() {
      Message.loading();
      $timeout(function() {
        DaumMapModel.domMap.relayout();
        if ($stateParams.findMe === 'true') {
          DaumMapModel.findMeThenSearchNearBy();
        } else {
          Message.hide();
        }
      }, 10);
    });

  }
})();
