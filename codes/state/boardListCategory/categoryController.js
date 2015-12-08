(function() {
  'use strict';
  angular.module('app')
    .controller('CategoryController', CategoryController);

  CategoryController.$inject = [
    '$scope', '$state',
    'CategoryModel', 'LinkService', 'Posts'
  ];

  function CategoryController(
    $scope, $state,
    CategoryModel, LinkService, Posts
  ) {

    var Category = this;
    Category.Model = CategoryModel;

    Category.openLink = LinkService.open;


    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function onAfterEnter() {
      Posts.getPosts({
        category: $state.params.by,
        sort: 'id DESC',
        populates: 'photos'
      }).$promise
        .then(function(postsWrapper) {
          console.log("---------- postsWrapper.posts ----------");
          console.log(postsWrapper.posts);
          console.log("HAS TYPE: " + typeof postsWrapper.posts);

          CategoryModel.posts = postsWrapper.posts;
          CategoryModel.more = postsWrapper.more;
        })
        .catch(function(err) {
          console.log("---------- err ----------");
          console.log(err);
          console.log("HAS TYPE: " + typeof err);
        });
    }

    function onBeforeEnter() {
      return CategoryModel.loading = true;
    }
  }
})();
