(function() {
  'use strict';

  angular.module('app')
    .factory('CategoryModel', CategoryModel);

  CategoryModel.$inject = [];

  function CategoryModel() {

    var model = {
      posts: [{
        id: 1,
        title: '대학교 잡지 "장터 매거진 8월호" 출간',
        photos: [{
          url: 'http://lorempixel.com/400/200/sports/1'
        }],
        url: 'http://www.naver.com'
      }, {
        id: 2,
        title: '학교장터 멋지다',
        photos: [{
          url: 'http://lorempixel.com/400/200/sports/2'
        }],
        url: 'http://www.naver.com'
      }, {
        id: 3,
        title: '우리학교 케달로',
        photos: [{
          url: 'http://lorempixel.com/400/200/sports/3'
        }],
        url: 'http://www.naver.com'
      }]
    };
    return model;
  }
})();
