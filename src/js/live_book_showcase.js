import Eye from './eye';

let eye, submit;

function liveBookShowcase() {
  eye = new Eye();

  submit = document.querySelector('.liveBookShowcase__submit');
  submit.addEventListener('click', buy);
}

function buy() {
  submit.removeEventListener('click', buy);
  eye.oh();
  document.querySelector('.liveBook').classList.add('liveBook--bought');
}

export default liveBookShowcase;
