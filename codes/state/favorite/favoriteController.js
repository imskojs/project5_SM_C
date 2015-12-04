(function() {
  'use strict';
  angular.module('app')
    .controller('FavoriteController', FavoriteController);

  FavoriteController.$inject = ['FavoriteModel'];

  function FavoriteController(FavoriteModel) {

    var Favorite = this;
    Favorite.Model = FavoriteModel;


    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
  }
})();
