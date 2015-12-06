(function() {
  'use strict';
  angular.module('app')
    .controller('PostListController', PostListController);

  PostListController.$inject = ['Products', 'PostListModel', '$scope', '$timeout', 'Message', 'LinkService', '$stateParams', '$ionicScrollDelegate'];

  function PostListController(Products, PostListModel, $scope, $timeout, Message, LinkService, $stateParams, $ionicScrollDelegate) {

    // add ads on every end of multiples of adsOnRow
    // var adsOnRow = 2;

    var PostList = this;
    var searchMode = false;

    PostList.Model = PostListModel;

    PostList.dynamicStyle = dynamicStyle;
    PostList.searchWord = null;
    PostList.search = search;
    PostList.openLink = LinkService.openLink;
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
      Products.getProducts({
        type: $stateParams.type,
        limit: 20,
        populates: 'photos',
        sort: 'id DESC',
        filter: PostList.searchWord
      }).$promise
        .then(function success(productsWrapper) {
          console.log(productsWrapper.products);
          PostListModel.posts = productsWrapper.products;
          PostListModel.more = productsWrapper.more;
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
      if (post.isAds) {
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
      Products.getProducts({
        category: $stateParams.category,
        type: $stateParams.type,
        sort: 'id DESC',
        limit: 20,
        populates: 'photos',
      }).$promise
        .then(function success(productsWrapper) {
          console.log(productsWrapper);

          // var results = [];
          // angular.forEach(productsWrapper.products, function(product) {
          //   if (product.soldOut === false) {
          //     results.push(product);
          //   }
          // });
          // PostListModel.posts = results;

          PostListModel.posts = productsWrapper.products;
          PostListModel.more = productsWrapper.more;
          addAdsToPosts(2, false);
          $ionicScrollDelegate.resize();
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
          skip: PostListModel.posts.length,
          limit: 20,
          populates: 'photos'
        }).$promise;
      } else if (searchMode === true) {
        promise = Products.getProducts({
          skip: PostListModel.posts.length,
          type: $stateParams.type,
          limit: 20,
          populates: 'photos',
          sort: 'id DESC',
          filter: PostList.searchWord
        }).$promise;
      }
      promise
        .then(function success(productsWrapper) {
          PostListModel.more = productsWrapper.more;
          angular.forEach(productsWrapper.products, function(product) {
            PostListModel.posts.push(product);
          });
          $ionicScrollDelegate.resize();
          $scope.$broadcast('scroll.infiniteScrollComplete');
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

    function addAdsToPosts(adsOnRow) {

    }

  } // END;
})();
