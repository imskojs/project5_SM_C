(function() {
  'use strict';
  angular.module('app')
    .controller('AnnouncementDetailController', AnnouncementDetailController);

  AnnouncementDetailController.$inject = [
    '$scope', '$state',
    'AnnouncementDetailModel', 'Posts', 'Comment', 'Ua'
  ];

  function AnnouncementDetailController(
    $scope, $state,
    AnnouncementDetailModel, Posts, Comment, Ua
  ) {

    var AnnouncementDetail = this;
    AnnouncementDetail.Model = AnnouncementDetailModel;

    AnnouncementDetail.getUserPhoto = getUserPhoto;
    $scope.$on('$ionicView.enter', onEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function onEnter() {
      Posts.getPosts({
          id: $state.params.id,
          populates: 'createdBy,photos'
        }).$promise
        .then(function(postsWrapper) {
          AnnouncementDetailModel.post = postsWrapper.posts[0];
          console.log("---------- postsWrapper.posts ----------");
          console.log(postsWrapper.posts);
          console.log("HAS TYPE: " + typeof postsWrapper.posts);

        })
        .catch(function(err) {
          console.log("---------- err ----------");
          console.log(err);
          console.log("HAS TYPE: " + typeof err);
        });
    }

    function onAfterEnter() {
      return commentFind()
        .then(function(commentsWrapper) {
          console.log("commentsWrapper :::\n", commentsWrapper);
          Ua.bindData(commentsWrapper, AnnouncementDetailModel, 'comments');
        })
        .catch(function(err) {
          console.log("err :::\n", err);
          // Ua.error(err);
        });
    }

    function getUserPhoto(user) {
      if (user && user.profile_picture && user.profile_picture.url) {
        return user.profile_picture.url;
      }
      if (user && user.profile_image) {
        return user.profile_image;
      }
    }

    //====================================================
    //  REST
    //====================================================
    function commentFind() {
      var queryWrapper = {
        post: $state.params.id
      };
      return Comment.find(queryWrapper).$promise
        .then(function(commentsWrapper) {
          return commentsWrapper;
        });
    }
  }
})();
