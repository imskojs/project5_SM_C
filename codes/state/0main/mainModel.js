(function() {
  'use strict';

  angular.module('app')
    .factory('MainModel', MainModel);

  MainModel.$inject = ['appStorage'];

  function MainModel(appStorage) {

    var model = {

      sideMenuList: [{
        name: '카테고리'
      }, {
        name: '상품등록'
      }, {
        name: '판매관리'
      }, {
        name: '찜/댓글'
      }],

      categoryList: [{
        name: 'maleCloth',
        korean: '남성의류'
      }, {
        name: 'femaleCloth',
        korean: '여성의류'
      }, {
        name: 'book',
        korean: '서적'
      }, {
        name: 'help',
        korean: '도와줘'
      }, {
        name: 'room',
        korean: '방'
      }, {
        name: 'donation',
        korean: '재능기부'
      }, {
        name: 'homeDeco',
        korean: '가전'
      }, {
        name: 'etc',
        korean: '기타'
      }],

      sideMenuSetting: [{
        name: '프로필 변경'
      }, {
        name: '쪽지함'
      }, {
        name: '알림설정'
      }, {
        name: '회원탈퇴'
      }],
      alarmOn: appStorage.alarm
    };
    return model;
  }
})();
