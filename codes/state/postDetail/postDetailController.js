(function() {
  'use strict';
  angular.module('app')
    .controller('PostDetailController', PostDetailController);

  PostDetailController.$inject = ['PostDetailModel', 'Products', 'Comments', 'Users', 'appStorage', '$ionicModal', '$scope', 'LinkService', 'FavoriteService', '$state', '$stateParams', 'Message', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', '_', '$timeout', 'Messages', '$ionicHistory'];

  function PostDetailController(PostDetailModel, Products, Comments, Users, appStorage, $ionicModal, $scope, LinkService, FavoriteService, $state, $stateParams, Message, $ionicScrollDelegate, $ionicSlideBoxDelegate, _, $timeout, Messages, $ionicHistory) {

    var PostDetail = this;
    PostDetail.Model = PostDetailModel;

    PostDetail.comment = null;
    PostDetail.commentReply = null;

    PostDetail.isFavorite = FavoriteService.isFavorite;
    PostDetail.call = LinkService.call;

    PostDetail.getUserPhoto = getUserPhoto;
    PostDetail.getUserNickname = getUserNickname;
    PostDetail.addComment = addComment;
    PostDetail.reply = reply;
    PostDetail.sendMessage = sendMessage;
    PostDetail.postMessage = postMessage;
    PostDetail.toggleSaveToFavorite = toggleSaveToFavorite;
    PostDetail.requestLoginHandler = requestLoginHandler;
    PostDetail.goBack = goBack;
    PostDetail.replyModalHandler = replyModalHandler;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

    //====================================================
    //  Implementations
    //====================================================
    function getUserPhoto(user) {
      if (user && user.profile_picture && user.profile_picture.url) {
        return user.profile_picture.url;
      }
      if (user && user.profile_image) {
        return user.profile_image;
      }
    }

    function getUserNickname(createdBy) {
      return createdBy && createdBy.nickname;
    }

    function addComment(comment) {
      if (!appStorage.token) {
        return PostDetail.requestLoginModal.show();
      }
      Comments.addCommentToPost({}, {
        content: comment,
        product: $stateParams.id,
        isParent: true
      }).$promise
        .then(function success(data) {
          console.log(data);
          // PostDetailModel.post.comments.push(data);
          // $ionicScrollDelegate.resize();
          Message.alert('댓글달기 알림', '댓글을 성공적으로 작성하셨습니다.')
            .then(function alertCB() {
              resetComment();
              $state.reload();
            });
        })
        .catch(function error(err) {
          console.log('error');
          console.log(err);
        });
    }

    function reply() {
      if (!appStorage.token) {
        return PostDetail.requestLoginModal.show();
      }
      var parentId = PostDetailModel.commentToReply.id;
      var commentReply = PostDetail.commentReply;

      return Comments.reply({}, {
          parent: parentId,
          content: commentReply,
          product: $stateParams.id
        }).$promise
        .then(function success() {
          return Message.alert('답변하기 알림', '답변을 성공적으로 하였습니다.');
        })
        .then(function alertCB() {
          PostDetail.replyModal.hide();
          $state.reload();
        })
        .catch(function error(err) {
          console.log("---------- err ----------");
          console.log(err);
          console.log("HAS TYPE: " + typeof err);
          console.log("---------- CONSOLE END -------------------");
        });
    }

    function sendMessage() {
      if (!appStorage.token) {
        return Message.alert('쪽지보내기 알림', '로그인을 해주세요')
          .then(function() {
            $state.go('main.login');
          });
      }
      PostDetail.currentDate = new Date();
      PostDetail.sendMessageModal.show();
    }

    function postMessage() {
      var message = PostDetail.message;
      Message.loading();
      Messages.sendMessage({}, {
        message: message,
        to: PostDetailModel.post.createdBy.id
      }).$promise
        .then(function success(message) {
          console.log(message);
          Message.hide();
          return Message.alert('메세지 작성 알림', '메세지가 성공적으로 작성되었습니다');
        })
        .then(function() {
          PostDetail.sendMessageModal.hide();
        })
        .catch(function error(err) {
          Message.hide();
          console.log(err);
        });
    }

    function toggleSaveToFavorite(postId) {
      if (FavoriteService.isFavorite(postId)) {
        FavoriteService.unlike(postId);
      } else if (!FavoriteService.isFavorite(postId)) {
        FavoriteService.like(postId);
      }
      FavoriteService.toggleSaveToFavorite(postId);
    }

    function requestLoginHandler() {
      PostDetail.requestLoginModal.hide()
        .then(function() {
          $state.go('main.login');
        });
    }

    function goBack() {
      if ($stateParams.prev === 'main.daumMap') {
        return $state.go('main.daumMap', {
          id: $stateParams.id
        });
      } else {
        $ionicHistory.goBack();
      }
    }

    function replyModalHandler(comment) {
      PostDetailModel.commentToReply = comment;
      PostDetail.replyModal.show();
    }

    function onBeforeEnter() {
      Message.loading();
      reset();
      findById($stateParams.id);
    }

    //====================================================
    //  Helper Functions
    //====================================================
    function resetComment() {
      PostDetail.comment = null;
    }

    function reset() {
      PostDetail.commentReply = null;
      PostDetail.message = null;
      PostDetail.comment = null;
      PostDetailModel.post = {};
      PostDetailModel.comments = [];
    }

    function findById(id) {
      findAProductWithId(id)
        .then(findCommentsWithPostId)
        .then(processComments)
        .catch(function error(err) {
          console.log(err);
          Message.hide();
        });
    }

    //====================================================
    //  Helper^2
    //====================================================
    function findAProductWithId(id) {
      Message.loading();
      return Products.findById({
        id: id,
        populates: 'photos,createdBy'
      }).$promise;
    }

    function findCommentsWithPostId(post) {
      console.log(post);
      PostDetailModel.post = post;
      $ionicSlideBoxDelegate.update();
      $ionicScrollDelegate.resize();
      if (!appStorage.token) {
        throw new Error('not logged in');
      }
      return Comments
        .find({
          productId: post.id
        }).$promise;
    }

    function processComments(comments) {
      PostDetailModel.comments = comments;
      Message.hide();
      console.log("---------- comments ----------");
      console.log(comments);
      console.log("HAS TYPE: " + typeof comments);
      console.log("---------- CONSOLE END -------------------");
    }

    //====================================================
    //  Modals
    //====================================================
    $ionicModal.fromTemplateUrl('state/modal/requestLogin.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      PostDetail.requestLoginModal = modal;
    });

    $ionicModal.fromTemplateUrl('state/modal/sendMessage.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      PostDetail.sendMessageModal = modal;
    });

    $ionicModal.fromTemplateUrl('state/modal/replyModal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      PostDetail.replyModal = modal;
    });

    $ionicModal.fromTemplateUrl('state/modal/fullSlideBoxModal.html', {
      scope: $scope,
      animation: 'mh-slide'
    }).then(function(modal) {
      PostDetail.slideBoxModal = modal;
    });

  }
})();
