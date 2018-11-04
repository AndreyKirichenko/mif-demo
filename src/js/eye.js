import throttle from './throttle'

const BLINK_TIMEOUT = 8000;
const DEBOUNCE_TIMEOUT = 100;

class Eye {
  constructor() {
    this.isCrazy = false;
    this.eye = document.querySelector('.eye');
    this.pupil = document.querySelector('.eye__pupil');
    this.eyelidsAnimate = document.querySelector('#svgEyelidAnimate');

    this.mouseX = 0;
    this.mouseY = 0;

    if(this.eye && this.pupil && this.eyelidsAnimate) {
      this.updateSizes();
      this.initPupil();
      this.initBlink();
    }
  }

  updateSizes() {
    this.pupilRelWin = this.pupil.getBoundingClientRect();
    this.eyeSize = this.eye.offsetWidth;
  }

  initPupil() {
    window.addEventListener('resize', () => {
      this.updateSizes();
    });

    let debouncedUpdate = throttle(() => this.pupilUpdate(), DEBOUNCE_TIMEOUT);

    window.addEventListener('mousemove', (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      debouncedUpdate();
    });
  }

  pupilUpdate() {
    let a = Eye.getCathetus(this.mouseX, this.pupilRelWin.left);
    let b = Eye.getCathetus(this.mouseY, this.pupilRelWin.top);

    let c = Math.hypot(a, b);

    let sin = a / c;
    let cos = b / c;

    let strength = Eye.getStrength(c);

    this.pupilMove(sin, cos, strength);
  }

  static getStrength(hypot) {
    let winMinSize = Eye.getWindowMinSize();
    return hypot / winMinSize;
  }
  
  static getWindowMinSize() {
    return window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
  }

  static getCathetus(mousePosition, pupilPosition) {
    return mousePosition - pupilPosition;
  }

  pupilMove(sin, cos, strength) {
    let xOffset = sin * this.eyeSize / 2 * strength - this.pupil.offsetWidth / 2;
    let yOffset = cos * this.eyeSize / 2 * strength - this.pupil.offsetHeight / 2;

    this.pupil.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

    if(this.isCrazy) {
      let xBgOffset = sin * this.eyeSize / 2 * strength - this.eyeSize / 2;
      let yBgOffset = cos * this.eyeSize / 2 * strength - this.eyeSize / 2;

      this.eye.style.backgroundPosition = `${xBgOffset}px ${yBgOffset}px`;
    }
  }

  initBlink() {
    setTimeout(() => {
      this.eyelidsAnimate.beginElement();
      this.initBlink();
    }, Math.random() * BLINK_TIMEOUT)
  }

  oh() {
    this.isCrazy = true;
    this.eye.classList.add('eye--oh');
  }
}

export default Eye;
