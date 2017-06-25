import { gzip } from 'zlib';

export default content => (
  new Promise(
    (resolve, reject) => (
      gzip(
        typeof content === 'string' ? Buffer.from(content) : content,
        (err, result) => (err ? reject(err) : resolve(result)),
      )
    ),
  )
);
