(function() {
  'use strict';

  angular.module('app')
    .factory('PostListModel', PostListModel);

  PostListModel.$inject = [];

  function PostListModel() {

    var model = {
      //====================================================
      //  post lists
      //====================================================
      posts: [],
      prePosts: [],
      //====================================================
      //  Advertisements
      //====================================================
      ads: [{
        id: 1,
        title: '',
        summary: '',
        content: '',
        url: 'http://www.naver.com',
        photos: [{
          url: 'http://lorempixel.com/200/100/nature/1'
        }],
        isAds: true
      }, {
        id: 2,
        title: '',
        summary: '',
        content: '',
        url: 'http://www.naver.com',
        photos: [{
          url: 'http://lorempixel.com/200/100/nature/2'
        }],
        isAds: true
      }, {
        id: 3,
        title: '',
        summary: '',
        content: '',
        url: 'http://www.naver.com',
        photos: [{
          url: 'http://lorempixel.com/200/100/nature/3'
        }],
        isAds: true
      }, {
        id: 4,
        title: '',
        summary: '',
        content: '',
        url: 'http://www.naver.com',
        photos: [{
          url: 'http://lorempixel.com/200/100/nature/4'
        }],
        isAds: true
      }]
    };
    return model;
  }
})();
