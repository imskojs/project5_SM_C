(function() {
  'use strict';
  angular.module('app')
    .controller('MapController', MapController);

  MapController.$inject = ['MapModel'];

  function MapController(MapModel) {

    var Map = this;
    Map.Model = MapModel;


    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
  }
})();
