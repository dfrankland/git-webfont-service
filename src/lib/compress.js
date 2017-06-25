import { gzip, deflate } from 'zlib';
import { compress as brotli } from 'iltorb';

const compressPromise = (content, method) => (
  new Promise(
    (resolve, reject) => (
      method(
        typeof content === 'string' ? Buffer.from(content) : content,
        (err, result) => (err ? reject(err) : resolve(result)),
      )
    ),
  )
);

export default (content, encoding) => {
  switch (encoding) {
    case 'br':
      return compressPromise(content, brotli);
    case 'gzip':
      return compressPromise(content, gzip);
    case 'deflate':
      return compressPromise(content, deflate);
    case 'identity':
    default:
      return Promise.resolve(content);
  }
};
