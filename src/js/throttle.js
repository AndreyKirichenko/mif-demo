function throttle (callback, timeout) {
  let timer = null;

  return function (...args) {
    const onComplete = () => {
      callback.apply(this, args);
    };

    timer = setInterval(onComplete, timeout);
  }
}

export default throttle;