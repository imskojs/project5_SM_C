// Ionic Starter App
(function() {
  'use strict';

  angular.module('app', [
    'ionic',
    'ngCordova',
    'ngResource',
    'ngTemplates',
    'ngStorage',
    'ngFileUpload',
    'ngTagsInput',
  ])

  .run([

    '$ionicPlatform', '$rootScope', '$stateParams', '$state', 'AuthService', '$window', '$ionicHistory', '$ionicSideMenuDelegate', 'Message', '$timeout', 'appStorage', '$ionicModal',

    function($ionicPlatform, $rootScope, $stateParams, $state, AuthService, $window, $ionicHistory, $ionicSideMenuDelegate, Message, $timeout, appStorage, $ionicModal) {

      $rootScope.isState = isState;
      $rootScope.areStates = areStates;
      $rootScope.getState = getState;
      $rootScope.isParam = isParam;
      $rootScope.getParam = getParam;
      $rootScope.goToState = goToState;
      $rootScope.toggleSideMenu = toggleSideMenu;
      $rootScope.loading = loading;
      $rootScope.goBack = goBack;
      $rootScope.closeSideMenu = closeSideMenu;
      $rootScope.appStorage = appStorage;
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.mainType = null;

      $ionicPlatform.ready(onReady);

      //====================================================
      //  IMPLEMENTATIONS
      //====================================================
      // DEPRECATED use $state.is('state.name', {param1: param1, param2: param2})
      function isState(state) {
        return state === $ionicHistory.currentStateName();
      }

      function areStates(states) {
        return states.indexOf($ionicHistory.currentStateName()) !== -1;
      }

      function getState() {
        return $ionicHistory.currentStateName();
      }

      // DEPRECATED use ui-sref="main.home({param1: param1, param2: param2})"
      function goToState(state, params) {
        $ionicSideMenuDelegate.toggleLeft(false);
        $state.go(state, params);
      }

      function isParam(paramObj) {
        for (var key in paramObj) {
          if ($stateParams[key] !== paramObj[key]) {
            return false;
          }
        }
        return true;
      }

      function getParam(key) {
        return $stateParams[key];
      }
      //====================================================
      //  Global scope should not do this on global...
      //====================================================
      $ionicModal.fromTemplateUrl('state/modal/requestEditProfile.html', {
        scope: $rootScope,
        animation: 'mh-slide'
      }).then(function(modal) {
        $rootScope.requestEditProfileModal = modal;
      });

      $rootScope.handleCloseEditProfileModal = function() {
        if (!appStorage.token) {
          $rootScope.requestEditProfileModal.hide();
          $state.go('main.login');
          closeSideMenu();
        } else if (appStorage.token) {
          $rootScope.requestEditProfileModal.hide();
          $state.go('main.profile');
          closeSideMenu();
        }
      };

      function toggleSideMenu() {
        if (!appStorage.user) {
          appStorage.user = {};
        }
        if (!appStorage.user.profile_picture || !appStorage.user.nickname || !appStorage.user.phone) {
          $rootScope.requestEditProfileModal.show();
        }
        $ionicSideMenuDelegate.toggleLeft();
      }

      function closeSideMenu() {
        $ionicSideMenuDelegate.toggleLeft(false);
      }

      function loading() {
        Message.loading();
        $timeout(function() {
          Message.hide();
        }, 2000);
      }

      function goBack() {
        $ionicHistory.goBack();
      }

      function onReady() {
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
          $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          $state.go('main.home');
        }
        if ($window.StatusBar) {
          $window.StatusBar.styleDefault();
        }
        $ionicPlatform.registerBackButtonAction(function(e) {
          e.preventDefault();
          if (areStates(['main.home'])) {
            return ionic.Platform.exitApp();
          }
          if (areStates(['main.postList'])) {
            if ($stateParams.category) {
              return $state.go('main.postList', {
                type: $stateParams.type,
                category: null
              });
            } else {
              return $state.go('main.home');
            }
          }
          if (areStates(['main.announcement.list', 'main.boardList.category'])) {
            return $state.go('main.home');
          }
          if (areStates(['main.postDetail'])) {
            if ($stateParams.prev === 'main.daumMap') {
              return $state.go('main.daumMap', {
                id: $stateParams.id
              });
            }
          }
          if (areStates(['main.favorite.saved'])) {
            return $state.go('main.postList', {
              type: 'local'
            });
          }
          $ionicHistory.goBack();
        }, 101);
      }


      $state.go('main.home');

    }
  ])

  .config([

    '$stateProvider', '$httpProvider',

    function($stateProvider, $httpProvider) {

      $httpProvider.interceptors.push('AuthInterceptor');

      $stateProvider

      .state('main', {
        url: '/main',
        templateUrl: 'state/0main/main.html',
        controller: 'MainController as Main'
      })

      .state('main.daumMap', {
        url: '/daumMap/:id/:findMe',
        views: {
          main: {
            templateUrl: 'state/daumMap/daumMap.html',
            controller: 'DaumMapController as Map'
          }
        }
      })

      .state('main.signup', {
        url: '/signup',
        views: {
          main: {
            templateUrl: 'state/signup/signup.html',
            controller: 'SignupController as Signup'
          }
        }
      })

      .state('main.login', {
        url: '/login',
        views: {
          main: {
            templateUrl: 'state/login/login.html',
            controller: 'LoginController as Login'
          }
        }
      })

      .state('main.profile', {
        url: '/profile',
        views: {
          main: {
            templateUrl: 'state/profile/profile.html',
            controller: 'ProfileController as Profile'
          }
        }
      })

      .state('main.favorite', {
        url: '/favorite',
        views: {
          main: {
            templateUrl: 'state/favorite/favorite.html',
            controller: 'FavoriteController as Favorite'
          }
        }
      })
        .state('main.favorite.saved', {
          url: '/saved/:type/:by',
          views: {
            favorite: {
              templateUrl: 'state/favoriteSaved/saved.html',
              controller: 'SavedController as Saved'
            }
          }
        })

      .state('main.home', {
        url: '/home',
        views: {
          main: {
            templateUrl: 'state/home/home.html',
            controller: 'HomeController as Home'
          }
        }
      })

      .state('main.postList', {
        url: '/postList/:type/:category',
        views: {
          main: {
            templateUrl: 'state/postList/postList.html',
            controller: 'PostListController as PostList'
          }
        }
      })

      .state('main.postDetail', {
        url: '/postDetail/:type/:id/:prev',
        views: {
          main: {
            templateUrl: 'state/postDetail/postDetail.html',
            controller: 'PostDetailController as PostDetail'
          }
        }
      })

      .state('main.postRegister', {
        url: '/postRegister/:type/:method/:id',
        views: {
          main: {
            templateUrl: 'state/postRegister/postRegister.html',
            controller: 'PostRegisterController as PostRegister'
          }
        }
      })

      .state('main.myPostList', {
        url: '/myPostList/:type',
        views: {
          main: {
            templateUrl: 'state/myPostList/myPostList.html',
            controller: 'MyPostListController as MyPostList'
          }
        }
      })

      .state('main.messageList', {
        url: '/messageList',
        views: {
          main: {
            templateUrl: 'state/messageList/messageList.html',
            controller: 'MessageListController as MessageList'
          }
        }
      })

      .state('main.messageDetail', {
        url: '/messageDetail/:from/:nickname',
        views: {
          main: {
            templateUrl: 'state/messageDetail/messageDetail.html',
            controller: 'MessageDetailController as MessageDetail'
          }
        }
      })

      .state('main.boardList', {
        abstract: true,
        url: '/boardList',
        views: {
          main: {
            templateUrl: 'state/boardList/boardList.html',
            controller: 'BoardListController as BoardList'
          }
        }
      })
        .state('main.boardList.category', {
          url: '/category/:by',
          views: {
            boardList: {
              templateUrl: 'state/boardListCategory/category.html',
              controller: 'CategoryController as Category'
            }
          }
        })

      .state('main.announcement', {
        abstract: true,
        url: '/announcement',
        views: {
          main: {
            templateUrl: 'state/announcement/announcement.html',
            controller: 'AnnouncementController as Announcement'
          }
        }
      })
        .state('main.announcement.list', {
          url: '/list/:by',
          views: {
            announcement: {
              templateUrl: 'state/announcementList/announcementList.html',
              controller: 'AnnouncementListController as AnnouncementList'
            }
          }
        })

      .state('main.announcementDetail', {
        url: '/announcementDetail/:by/:id',
        views: {
          main: {
            templateUrl: 'state/announcementDetail/announcementDetail.html',
            controller: 'AnnouncementDetailController as AnnouncementDetail'
          }
        }
      })

      .state('main.map', {
        url: '/map/:id',
        views: {
          main: {
            templateUrl: 'state/map/map.html',
            controller: 'MapController as Map2'
          }
        }
      })

      .state('main.googleMap', {
        url: '/googleMap/:id',
        views: {
          main: {
            templateUrl: 'state/googleMap/googleMap.html',
          }
        }
      });




    } //END
  ]);
})();
