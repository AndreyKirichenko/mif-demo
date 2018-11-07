import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import dndLists from 'angular-drag-and-drop-lists';
import randomColor from 'randomcolor';

const SHOW_ON_PAGE = 8;

function productsShowcase() {
  let showcase = angular.module('showcase', ['dndLists', 'ngSanitize']);

  showcase.controller('showcaseListCtrl', ['$scope', '$http', ($scope, $http) => {
    $scope.data = $http.get('data/books.json').then((loadedData) => {
      let showOnPage = SHOW_ON_PAGE;
      let loadedBooks = normalize(loadedData.data);

      $scope.models = {
        selected: null,
        books: loadedBooks
      };

      $scope.dragOverHandler = (event) => {
        // let crt = this.cloneNode(true);
        // crt.style.display = "none";
        // document.body.appendChild(crt);
        let dragged = event.currentTarget;
        // dragged.style = 'opacity: 0;';
        event.dataTransfer.setDragImage(d ragged, 0, 0);
      };

      $scope.moreButtonClickHandler = () => {
        showOnPage += SHOW_ON_PAGE;
      }
    });
  }]);
}

function normalize(data) {
  return data.map((book) => {
    return {
      url: book.url,
      description: addClassNameToLinks(book.description),
      ribbonColor: randomColor()
    }
  });
}

function addClassNameToLinks(str) {
  return str.replace('<a', '<a class=link ');
}

export default productsShowcase;
