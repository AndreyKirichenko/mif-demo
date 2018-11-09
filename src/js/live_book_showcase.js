class LiveBookShowcase {
  constructor($scope) {
    this.$scope = $scope;
    $scope.isBought = false;
    $scope.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.$scope.isBought = true;
    this.$scope.$broadcast('liveBookBuy');
  }
}

export default LiveBookShowcase;
