(function() {
  'use strict';
  angular.module('app')
    .controller('AnnouncementListController', AnnouncementListController);

  AnnouncementListController.$inject = [
    '$scope', '$state', '$ionicScrollDelegate',
    'AnnouncementListModel', 'Posts'
  ];

  function AnnouncementListController(
    $scope, $state, $ionicScrollDelegate,
    AnnouncementListModel, Posts
  ) {

    var AnnouncementList = this;
    AnnouncementList.Model = AnnouncementListModel;

    $scope.$on('$ionicView.enter', onEnter);

    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function onEnter() {
      console.log("---------- $state.params.by ----------");
      console.log($state.params.by);
      console.log("HAS TYPE: " + typeof $state.params.by);

      return Posts.getPosts({
          category: $state.params.by,
          sort: 'id DESC',
          limit: 120
        }).$promise
        .then(function(postsWrapper) {
          AnnouncementListModel.posts = postsWrapper.posts;
          AnnouncementListModel.more = postsWrapper.more;
          console.log("---------- postsWrapper ----------");
          console.log(postsWrapper);
          console.log("HAS TYPE: " + typeof postsWrapper);

          $ionicScrollDelegate.resize();
        })
        .catch(function(err) {
          console.log("---------- err ----------");
          console.log(err);
          console.log("HAS TYPE: " + typeof err);
        });
    }

    // function loadMore() {
    //   var last = AnnouncementListModel.posts.length - 1;
    //   return Posts.getPosts({}, {
    //       olderThan: AnnouncementListModel.posts[last].id,
    //       category: $state.params.by,
    //       sort: 'id DESC',
    //       limit: 20
    //     }).$promise
    //     .then(function(postsWrapper) {
    //       angular.forEach(postsWrapper.posts, function(post) {
    //         AnnouncementListModel.posts.push(post);
    //       });
    //       AnnouncementListModel.more = postsWrapper.more;
    //       $ionicScrollDelegate.resize();
    //     })
    //     .catch(function(err) {
    //       console.log("---------- err ----------");
    //       console.log(err);
    //       console.log("HAS TYPE: " + typeof err);
    //     });
    // }
  }
})();
