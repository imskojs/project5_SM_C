(function() {
  'use strict';

  angular.module('app')
    .factory('MockService', MockService);

  MockService.$inject = [];

  function MockService() {

    var service = {
      generatePosts: generatePosts
    };

    return service;

    //====================================================
    //  IMPLEMENTATIONS
    //====================================================
    function generatePosts(array, numberOfPosts, reset) {
      if (reset) {
        angular.copy([], array);
      }
      for (var i = 1; i <= numberOfPosts; i++) {
        var post = {
          id: i,
          title: '학교장터 ' + i + '번 상품',
          summary: '학교장터 ' + i + '번 상품 정말 좋습니다.',
          content: '학교장터 ' + i + '번 상품은 2014년 12월 ' + i + '일에 완성된 상품이며, 거의 사용하지 않은 상품입니다.',
          photos: [{
            url: 'http://lorempixel.com/100/200/technics/' + i
          }],
          likes: i + 10,
          commentsCount: i,
          comments: [{
            id: 1,
            name: '호도리',
            content: '정말 좋네요'
          }, {
            id: 2,
            name: '호도리',
            content: '정말 좋네요'
          }, {
            id: 3,
            name: '호도리',
            content: '정말 좋네요'
          }, {
            id: 4,
            name: '호도리',
            content: '정말 좋네요'
          }, {
            id: 5,
            name: '호도리',
            content: '정말 좋네요'
          }],
          category: '기타',
          price: 10000 + i * 1000,
          address: '중국 베이징 스징고라리고 고릴라 왕'
        };
        array.push(post);
      }
    }
  }
})();
