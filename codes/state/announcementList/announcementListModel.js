(function() {
  'use strict';

  angular.module('app')
    .factory('AnnouncementListModel', AnnouncementListModel);

  AnnouncementListModel.$inject = [];

  function AnnouncementListModel() {

    var model = {
      posts: [{
        id: 1,
        title: '학교장터 사용 유의할 점 필독바랍니다~!',
        content: '오리',
        createdBy: {
          user: '관리자'
        },
        createdAt: new Date()
      }, {
        id: 2,
        title: '공지사항 잘되나요',
        content: '오리',
        createdBy: {
          user: '관리자'
        },
        createdAt: new Date()

      }, {
        id: 3,
        title: '공지 사항 잘되는것 같나요',
        content: '오리',
        createdBy: {
          user: '관리자'
        },
        createdAt: new Date()

      }]

    };
    return model;
  }
})();
