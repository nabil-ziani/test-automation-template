export const promiseWithTimeout = function (promise) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, 300);
  });

  return {
    promiseOrTimeout: Promise.race([promise, timeoutPromise]),
    timeoutId
  }
}