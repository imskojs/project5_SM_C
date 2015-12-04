(function() {
  'use strict';
  angular.module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['HomeModel', 'LinkService', 'Message'];

  function HomeController(HomeModel, LinkService, Message) {

    var Home = this;
    Home.Model = HomeModel;
    Home.share = share;
    Home.showMessage = showMessage;

    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function share() {
      var title = '학생들의 중고거래장터 학교장터!';
      var content = '집안에 잠들어있는 필요없는 물건들을 돈으로 바꿔가세요~';
      var url = 'https://play.google.com/store/apps/details?id=kr.co.schoolmarket&hl=ko';
      LinkService.share(title, content, url);
    }

    function showMessage() {
      return Message.alert('유학장터 알림', '유학장터 준비 중입니다.');
    }
  }
})();
