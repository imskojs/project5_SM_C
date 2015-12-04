(function() {
  'use strict';
  angular.module('app')
    .filter('categoryToKorean', categoryToKorean);

  categoryToKorean.$inject = [];

  function categoryToKorean() {
    return function(input) {
      if (input === 'maleCloth') {
        return '남성의류';
      } else if (input === 'femaleCloth') {
        return '여성의류';
      } else if (input === 'book') {
        return '서적';
      } else if (input === 'help') {
        return '도와줘';
      } else if (input === 'room') {
        return '방';
      } else if (input === 'donation') {
        return '재능기부';
      } else if (input === 'homeDeco') {
        return '가전';
      } else if (input === 'etc') {
        return '기타';
      } else {
        return '유학장터';
      }
    };
  }
})();
