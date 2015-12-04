(function() {
  'use strict';
  angular.module('app')
    .controller('BoardListController', BoardListController);

  BoardListController.$inject = ['BoardListModel'];

  function BoardListController(BoardListModel) {

    var BoardList = this;
    BoardList.Model = BoardListModel;


    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
  }
})();
