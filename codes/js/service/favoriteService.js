//====================================================
// createdBy;
// Seunghoon Ko (imskojs@gmail.com)
//====================================================
(function() {
  'use strict';

  angular.module('app')
    .factory('FavoriteService', FavoriteService);

  FavoriteService.$inject = ['appStorage', 'Products'];

  function FavoriteService(appStorage, Products) {

    var service = {
      like: like,
      unlike: unlike,
      toggleSaveToFavorite: toggleSaveToFavorite,
      isFavorite: isFavorite
    };

    return service;

    function like(postId) {
      return Products
        .like({
          postId: postId
        }).$promise
        .then(processProduct)
        .catch(error);

      function processProduct(product) {
        console.log(product);
      }

      function error(err) {
        console.log(err);
      }
    }

    function unlike(postId) {
      return Products
        .unlike({
          postId: postId
        }).$promise
        .then(processProduct)
        .catch(error);

      function processProduct(product) {
        console.log(product);
      }

      function error(err) {
        console.log(err);
      }
    }




    //====================================================
    //  FavoriteService.toggleSaveToFavorite
    //====================================================
    // Usage;
    //FavoriteService.toggleFavorite('1asf31sf1adf31')
    // Output(localStorage favorite array);
    //appStorage.favorite
    function toggleSaveToFavorite(id) {
      if (!Array.isArray(appStorage.favorite)) {
        appStorage.favorite = [];
      }
      if (isFavorite(id)) {
        var index = appStorage.favorite.indexOf(id);
        appStorage.favorite.splice(index, 1);
      } else if (!isFavorite(id)) {
        appStorage.favorite.push(id);
      }
      return appStorage.favorite;
    }


    //====================================================
    //  FavoriteService.isFavorite
    //====================================================
    // Usage;
    //FavoriteService.isFavorite('1asf31sf1adf31')
    // Output(boolean if id exists in appStorage.favorite);
    //true || false
    function isFavorite(id) {
      if (!Array.isArray(appStorage.favorite)) {
        appStorage.favorite = [];
      }
      for (var i = 0; i < appStorage.favorite.length; i++) {
        if (String(id) === String(appStorage.favorite[i])) {
          return true;
        }
      }
      return false;
    }

  } // Service END
})();
