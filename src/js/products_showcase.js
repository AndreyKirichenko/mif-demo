import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import randomColor from 'randomcolor';
import throttle from './throttle'

const BOOKS_URL = 'data/books.json';
const DESKTOP_WIDTH = 1000;
const SHOW_ON_PAGE = 8;

class ProductsShowcase {
  constructor() {
    this.module = angular.module('showcase', ['ngSanitize']);
    this.controller = this.module.controller('showcaseListCtrl', ['$scope', '$http', ($scope, $http) => {
      ProductsShowcase.loadData($http).then((loadedData) => {
        this.initScope($scope);
        this.onDataLoaded(loadedData);
      });
    }]);

    this.module.directive('onFinishRender',['$timeout', '$parse', function ($timeout, $parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          if (scope.$last === true) {
            $timeout(function () {
              scope.$emit('ngRepeatFinished');
              if(!!attr.onFinishRender){
                $parse(attr.onFinishRender)(scope);
              }
            });
          }
        }
      }
    }])
  }

  onDataLoaded(loadedData) {
    this.loadedBooks = this.normalize(loadedData.data);
    this.initModel();
    this.initResizeListener();
  }

  initScope($scope) {
    this.$scope = $scope;
    this.$scope.onFinishBooksRender = this.updateBookCoords.bind(this);
    this.$scope.moreButtonClickHandler = this.loadBookPart.bind(this);
    this.$scope.bookMouseDownHandler = this.drag.bind(this);
    this.$scope.bookMouseMoveHandler = this.move.bind(this);
    this.$scope.bookMouseUpnHandler = this.drop.bind(this);
  }

  initResizeListener() {
    this.dragAndDrop = {};

    window.addEventListener('resize', () => {
      this.dragAndDrop.disabled = window.outerWidth < DESKTOP_WIDTH;
    });
  }

  initModel() {
    this.$scope.books = [];
    this.loadBookPart();
  }

  loadBookPart() {
    let booksInModel = this.$scope.books.length;
    this.$scope.books.push(...this.loadedBooks.slice(booksInModel, booksInModel + SHOW_ON_PAGE));

    if(this.$scope.books.length === this.loadedBooks.length) {
      this.hideButton();
    }
  }

  hideButton() {
    this.$scope.buttonIsHidden = true;
  }

  updateBookCoords() {
    let bookElements = document.querySelectorAll('.productsShowcase__item');

    this.bookCoords = Array.from(bookElements).map((element, index) => {
      let box = element.getBoundingClientRect();

      let width = element.offsetWidth;
      let height = element.offsetHeight;

      let left = box.x + window.pageXOffset;
      let top = box.y + window.pageYOffset;
      let right = left + width;
      let bottom = top + height;

      return {
        bottom,
        index,
        left,
        right,
        top,
        halfWidth: width / 2
      };
    });
  }

  getItemPositionToDrop(mousePageX, mousePageY) {
    let current = this.bookCoords.find((elementCoords) => {
      let a = elementCoords.left < mousePageX;
      let b = elementCoords.right > mousePageX;
      let c = elementCoords.top < mousePageY;
      let d = elementCoords.bottom > mousePageY;

      return a && b && c && d;
    });

    if(current) {
      current.marker = 0;

      if(current.left + current.halfWidth < mousePageX) {
        current.marker = 1;
      }
    }

    return current;
  }

  drag(event, index) {
    event.preventDefault();

    let draggedItem = this.$scope.books[index];
    draggedItem.isDragged = true;

    this.dragAndDrop = {
      draggedItem,
      draggedItemIndex: index,
      mouseOnDragStart: {
        screenX: event.screenX,
        screenY: event.screenY
      }
    };
  }

  move(event, index) {
    if(!this.dragAndDrop.disabled && !this.dragAndDrop.draggedItem) {
      return;
    }

    event.preventDefault();

    this.processDrag(event, index);
  }

  processDrag(event) {
    let offsetX =  -(this.dragAndDrop.mouseOnDragStart.screenX - event.screenX);
    let offsetY =  -(this.dragAndDrop.mouseOnDragStart.screenY - event.screenY);

    this.dragAndDrop.draggedItem.transform = `transform: translate(${offsetX}px, ${offsetY}px)`;

    let itemPositionToDrop = this.getItemPositionToDrop(event.pageX, event.pageY);

    this.clearMarker();

    if(itemPositionToDrop) {
      this.$scope.books[itemPositionToDrop.index].marker = itemPositionToDrop.marker;
    }
  }

  drop(event) {
    this.dragAndDrop.draggedItem.isDragged = false;
    this.dragAndDrop.draggedItem.transform = '';
    this.dragAndDrop.draggedItem = null;

    let itemPositionToDrop = this.getItemPositionToDrop(event.pageX, event.pageY);

    if(itemPositionToDrop) {
      this.dragAndDrop.draggedItemNewIndex = itemPositionToDrop.index;
      if(this.dragAndDrop.draggedItemIndex !== this.dragAndDrop.draggedItemNewIndex) {
        this.dragAndDrop.draggedItemNewIndex += itemPositionToDrop.marker - 1;
      }
      console.log('itemPositionToDrop.marker', itemPositionToDrop.marker);
      this.moveBookInScope(this.dragAndDrop.draggedItemIndex, this.dragAndDrop.draggedItemNewIndex);
    }
    this.clearMarker();
  }

  moveBookInScope(oldIndex, newIndex) {
    console.log(oldIndex, newIndex);
    if(oldIndex === newIndex) {
      return;
    }

    if(newIndex < 0) {
      return;
    }

    if (newIndex >= this.$scope.books.length) {
      let k = newIndex - this.$scope.books.length + 1;
      while (k--) {
        this.$scope.books.push(undefined);
      }
    }

    this.$scope.books.splice(newIndex, 0, this.$scope.books.splice(oldIndex, 1)[0]);
  };

  clearMarker() {
    this.$scope.books.forEach((book) => book.marker = -1);
  }

  normalize(data) {
    return data.map((book) => {
      return {
        url: book.url,
        description: ProductsShowcase.addClassNameToLinks(book.description),
        ribbonColor: randomColor()
      }
    });
  }

  static addClassNameToLinks(str) {
    return str.replace('<a', '<a class=link ');
  }

  static loadData($http) {
    return $http.get(BOOKS_URL);
  }
}

export default ProductsShowcase;
