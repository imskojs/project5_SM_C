(function() {
  'use strict';
  angular.module('app')
    .controller('AnnouncementDetailController', AnnouncementDetailController);

  AnnouncementDetailController.$inject = [
    '$scope', '$state',
    'AnnouncementDetailModel', 'Posts'
  ];

  function AnnouncementDetailController(
    $scope, $state,
    AnnouncementDetailModel, Posts
  ) {

    var AnnouncementDetail = this;
    AnnouncementDetail.Model = AnnouncementDetailModel;


    $scope.$on('$ionicView.enter', onEnter);
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
  }
})();
