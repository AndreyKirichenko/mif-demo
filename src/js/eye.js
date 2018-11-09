import throttle from './throttle'

const BLINK_TIMEOUT = 8000;
const THROTTLE_DELAY = 100;

class Eye {
  constructor($scope) {
    this.initScope($scope);
    this.initElements();
    this.initEvents();

    this.mouseX = 0;
    this.mouseY = 0;

    if(this.eye && this.pupil && this.eyelids) {
      this.updateSizes();
      this.initBlink();
      this.initPupil();
    }
  }

  initScope($scope) {
    this.$scope = $scope;
    this.$scope.isCrazy = false;
  }

  initEvents(){
    this.$scope.$on('liveBookBuy', () => {
      this.goCrazy();
    });
  }

  initElements() {
    this.eyelids = document.querySelector('#svgEyelidAnimate');
    this.eye = document.querySelector('.eye');
    this.pupil = document.querySelector('.eye__pupil');
  }

  initBlink() {
    setTimeout(() => {
      this.eyelids.beginElement();
      this.initBlink();
    }, Math.random() * BLINK_TIMEOUT)
  }

  updateSizes() {
    this.eyeSize = this.eye.offsetWidth;
  }

  initPupil() {
    let throttledUpdate = throttle(() => {
      this.$scope.$apply();
    }, THROTTLE_DELAY);

    window.addEventListener('mousemove', (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      throttledUpdate();
      this.pupilUpdate();
    });
  }

  pupilUpdate() {
    let pupilRelWin = this.pupil.getBoundingClientRect();
    let a = Eye.getCathetus(this.mouseX, pupilRelWin.left);
    let b = Eye.getCathetus(this.mouseY, pupilRelWin.top);

    let c = Math.hypot(a, b);

    let sin = a / c;
    let cos = b / c;

    let strength = Eye.getStrength(c);

    this.pupilMove(sin, cos, strength);
  }

  static getStrength(hypot) {
    let winMinSize = Eye.getWindowMaxSize();
    return hypot / winMinSize;
  }
  
  static getWindowMaxSize() {
    return window.innerWidth < window.innerHeight ? window.innerHeight : window.innerWidth;
  }

  static getCathetus(mousePosition, pupilPosition) {
    return mousePosition - pupilPosition;
  }

  pupilMove(sin, cos, strength) {
    let xOffset = sin * this.eyeSize / 2 * strength - this.pupil.offsetWidth / 2;
    let yOffset = cos * this.eyeSize / 2 * strength - this.pupil.offsetHeight / 2;

    this.$scope.pupilStyle = `transform: translate(${xOffset}px, ${yOffset}px)`;

    if(this.$scope.isCrazy) {
      let xBgOffset = sin * this.eyeSize / 2 * strength - this.eyeSize / 2;
      let yBgOffset = cos * this.eyeSize / 2 * strength - this.eyeSize / 2;

      this.$scope.eyeStyle = `background-position: ${xBgOffset}px ${yBgOffset}px`;
    }
  }

  goCrazy() {
    this.$scope.isCrazy = true;
  }
}

export default Eye;
