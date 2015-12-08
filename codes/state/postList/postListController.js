(function() {
  'use strict';
  angular.module('app')
    .controller('PostListController', PostListController);

  PostListController.$inject = [
    '$scope', '$timeout', '$stateParams', '$ionicScrollDelegate', '$q', '$state',
    '$window',
    'Products', 'PostListModel', 'Message', 'LinkService'
  ];

  function PostListController(
    $scope, $timeout, $stateParams, $ionicScrollDelegate, $q, $state,
    $window,
    Products, PostListModel, Message, LinkService
  ) {
    var _ = $window._;
    // add ads on every end of multiples of adsOnRow
    var adsOnRow = 2;
    var adsAdded = 0;

    var PostList = this;
    var searchMode = false;

    PostList.Model = PostListModel;

    PostList.dynamicStyle = dynamicStyle;
    PostList.searchWord = null;
    PostList.search = search;
    PostList.openLink = LinkService.open;
    PostList.getMoreProducts = getMoreProducts;
    PostList.checkForMore = checkForMore;

    PostList.showAlert = showAlert;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

    //====================================================
    //  Implementations
    //====================================================
    function search() {
      searchMode = true;
      Message.loading();
      var abroadSearch;
      var adsPromise;
      if ($state.params.type === 'abroad') {
        abroadSearch = true;
      } else {
        adsPromise = Products.getProducts({
          category: 'ads',
          isAds: true,
          limit: 10,
          populates: 'photos',
          filter: PostList.searchWord
        }).$promise;
      }
      var productsPromise = Products.getProducts({
        type: $stateParams.type,
        limit: 12,
        populates: 'photos',
        sort: 'id DESC',
        soldOut: false,
        filter: PostList.searchWord
      }).$promise;

      $q.all([productsPromise, adsPromise])
        .then(function success(array) {
          var productsWrapper = array[0];
          var adsWrapper = array[1];
          if (adsWrapper) {
            PostListModel.ads = adsWrapper.products;
          }
          adsAdded = 0;
          PostListModel.prePosts = [];
          angular.forEach(productsWrapper.products, function(product) {
            PostListModel.prePosts.push(product);
          });
          PostListModel.more = productsWrapper.more;

          addAdsToArray(productsWrapper.products, adsOnRow);
          PostListModel.posts = productsWrapper.products;
          $ionicScrollDelegate.resize();
          Message.hide();
        })
        .catch(function error(err) {
          console.log(err);
          Message.hide();
        });
    }

    function dynamicStyle(post) {
      var result = {};
      if (post && post.isAds) {
        result.height = '120';
        result.width = '99%';
      } else {
        result.height = '160';
        result.width = '33%';
      }
      return result;
    }


    function onBeforeEnter() {
      getProducts();
    }

    function getProducts() {
      searchMode = false;
      var productsPromise = Products.getProducts({
        category: $stateParams.category,
        type: $stateParams.type,
        sort: 'id DESC',
        soldOut: false,
        limit: 12,
        populates: 'photos',
      }).$promise;
      var adsPromise = Products.getProducts({
        category: 'ads',
        isAds: true,
        limit: 10,
        populates: 'photos'
      }).$promise;
      $q.all([productsPromise, adsPromise])
        .then(function success(array) {
          var productsWrapper = array[0];
          var adsWrapper = array[1];

          console.log("---------- productsWrapper.products ----------");
          console.log(productsWrapper.products);
          console.log("HAS TYPE: " + typeof productsWrapper.products);

          console.log("---------- adsWrapper.products ----------");
          console.log(adsWrapper.products);
          console.log("HAS TYPE: " + typeof adsWrapper.products);


          // isAds not working on the server.
          PostListModel.ads = adsWrapper.products;

          PostListModel.prePosts = [];
          angular.forEach(productsWrapper.products, function(product) {
            PostListModel.prePosts.push(product);
          });
          PostListModel.more = productsWrapper.more;

          addAdsToArray(productsWrapper.products, adsOnRow);
          $ionicScrollDelegate.resize();
          PostListModel.posts = productsWrapper.products;
          console.log("---------- PostListModel.posts ----------");
          console.log(PostListModel.posts);
          console.log("HAS TYPE: " + typeof PostListModel.posts);

        })
        .catch(function error(err) {
          Message.alert();
          console.log(err);
        });
    }

    function getMoreProducts() {
      var promise;
      if (searchMode === false) {
        promise = Products.getProducts({
          category: $stateParams.category,
          type: $stateParams.type,
          sort: 'id DESC',
          skip: PostListModel.prePosts.length,
          soldOut: false,
          limit: 12,
          populates: 'photos'
        }).$promise;
      } else if (searchMode === true) {
        promise = Products.getProducts({
          skip: PostListModel.prePosts.length,
          type: $stateParams.type,
          limit: 12,
          soldOut: false,
          populates: 'photos',
          sort: 'id DESC',
          filter: PostList.searchWord
        }).$promise;
      }
      promise
        .then(function success(productsWrapper) {
          PostListModel.more = productsWrapper.more;
          angular.forEach(productsWrapper.products, function(product) {
            // PostListModel.posts.push(product);
            PostListModel.prePosts.push(product);
          });
          addAdsToArray(productsWrapper.products, adsOnRow);
          console.log("---------- productsWrapper.products ----------");
          console.log(productsWrapper.products);
          console.log("HAS TYPE: " + typeof productsWrapper.products);

          angular.forEach(productsWrapper.products, function(product) {
            PostListModel.posts.push(product);
            // PostListModel.prePosts.push(product);
          });
          console.log("---------- PostListModel.posts ----------");
          console.log(PostListModel.posts);
          console.log("HAS TYPE: " + typeof PostListModel.posts);

          $scope.$broadcast('scroll.infiniteScrollComplete');
          $ionicScrollDelegate.resize();
        })
        .catch(function error(err) {
          console.log(err);
        });
    }

    function checkForMore() {
      return PostListModel.more;
    }

    function showAlert() {
      Message.alert('sold out 알림', '이미 팔린 물품입니다.');
    }
    //====================================================
    //  Helper
    //====================================================

    function addAdsToArray(productList, adsOnRow) {
      // do nothing if no ads in model
      var prePosts = PostListModel.prePosts;
      if (PostListModel.ads.length === 0) {
        return false;
      }
      // do not add if all ads are added.
      if (adsAdded > PostListModel.ads.length - 1) {
        return false;
      }
      if (adsAdded >= PostListModel.ads.length) {
        adsAdded = 0;
      }
      var adsIndexes = _.pluck(PostListModel.ads, 'index');

      for (var i = 10; i >= 2; i -= 2) {
        if (prePosts.length > adsOnRow * 3 * (i - 1)) {
          addAds(i - 1, i);
          break;
        }
      }

      function indexExists(index) {
        return adsIndexes.indexOf(index) !== -1;
      }

      function addAds(index1, index2) {
        if (productList.length >= adsOnRow * 3 && indexExists(index1)) {
          productList.splice(adsOnRow * 3, 0, _.where(PostListModel.ads, {
            index: index1
          })[0]);
        }

        if (productList.length >= adsOnRow * 3 * 2 + 1 && indexExists(index2) && indexExists(index1)) {
          productList.splice(adsOnRow * 3 * 2 + 1, 0, _.where(PostListModel.ads, {
            index: index2
          })[0]);
        } else if (productList.length >= adsOnRow * 3 * 2 && indexExists(index2)) {
          productList.splice(adsOnRow * 3 * 2, 0, _.where(PostListModel.ads, {
            index: index2
          })[0]);
        }
      }
    }




  } // END;
})();


// function addAdsToArray(array, adsOnRow) {
//   if (PostListModel.ads.length === 0) {
//     return false;
//   }
//   if (adsAdded > PostListModel.ads.length - 1) {
//     return false;
//   }
//   if (adsAdded >= PostListModel.ads.length) {
//     adsAdded = 0;
//   }
//   if (array.length >= adsOnRow * 3) {
//     array.splice(adsOnRow * 3, 0, PostListModel.ads[adsAdded]);
//     adsAdded++;
//   }

//   if (adsAdded >= PostListModel.ads.length) {
//     adsAdded = 0;
//   }
//   if (array.length >= adsOnRow * 3 * 2 + 1) {
//     array.splice(adsOnRow * 3 * 2 + 1, 0, PostListModel.ads[adsAdded]);
//     adsAdded++;
//   }
// }

// function addAdsToPosts(adsOnRow, upfront) {
//   var index = null;
//   if (upfront) {
//     index = 0;
//   } else {
//     index = adsOnRow * 3;
//   }
//   var posts = PostListModel.posts;
//   var ads = PostListModel.ads;
//   $timeout(function() {
//     for (var i = 0; i < ads.length; i++) {
//       posts.splice(index, 0, ads[i]);
//       index = index + adsOnRow * 3 + 1;
//     }
//   }, 0);
// }

// function addAdsToPosts(adsOnRow) {
//   // get ads and add to PostListModel.ads
//   PostListModel.ads = [];
//   var index = adsOnRow * 3;
//   return Products.getProducts({
//       limit: 10,
//       populates: 'photos',
//       isAds: true
//     }).$promise
//     .then(function removeAds(ads) {
//       PostListModel.ads = ads;
//       // remove ads from PostListModel.posts
//       var i;
//       for (i = 0; i < PostListModel.posts.length; i++) {
//         var post = PostListModel.posts[i];
//         if (post.isAds) {
//           PostListModel.posts.splice(i, 1);
//         }
//       }
//       // make sure we have enough ads to be filled in.
//       duplicateAds(adsOnRow);
//       for (i = 0; i < PostListModel.posts.length; i++) {
//         PostListModel.posts.splice(index, 0, ads[i]);
//         index = index + adsOnRow * 3 + 1;
//       }
//     })
//     .catch(function(err) {
//       console.log("---------- err ----------");
//       console.log(err);
//       console.log("HAS TYPE: " + typeof err);
//     });
// }
// function duplicateAds(adsOnRow) {
//   if (PostListModel.ads.length * adsOnRow * 3 < PostListModel.prePosts.length) {
//     PostListModel.ads = PostListModel.ads.concat(PostListModel.ads);
//     return duplicateAds(adsOnRow);
//   }
// }
