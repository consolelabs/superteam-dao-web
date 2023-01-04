const wait = (ms: number) =>
  new Promise((r) => {
    setTimeout(r, ms)
  })

export const retry = <T>(
  operation: () => Promise<T>,
  delay: number,
  retries: number,
): Promise<T> =>
  new Promise((resolve, reject) => {
    operation()
      .then(resolve)
      .catch((reason) => {
        if (retries > 0) {
          return wait(delay)
            .then(() => retry(operation, delay, retries - 1))
            .then(resolve)
            .catch(reject)
        }
        return reject(reason)
      })
  })
