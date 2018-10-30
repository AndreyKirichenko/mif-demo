function debounce (callback, timeout) {
  let timer = null;

  return function (...args) {
    const onComplete = () => {
      callback.apply(this, args);
      timer = null;
    };

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(onComplete, timeout);
  }
}

export default debounce;
