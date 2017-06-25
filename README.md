# git-webfont-service

Serve fonts from a git repo.

## Example

I want to load a font, FiraCode, in 3 different weights: 300, 500, 700. So to do
so, I must follow some simple steps.

1.  Start the server.

2.  Create a query string:

    ```js
    import { stringify } from 'qs';

    // Returns a query string like so:
    // `fonts[0][family]=FiraCode&fonts[0][weights][0]=300&fonts[0][weights][1]=500&fonts[0][weights][2]=700`
    stringify(
      {
        fonts: [
          { family: 'FiraCode', weights: ['300', '500', '700']  },
        ],
      },
      { encode: false },
    );
    ```

3.  Add a link to my HTML:

    ```html
    <link rel="stylesheet" href="http://localhost:3000/css?fonts[0][family]=FiraCode&fonts[0][weights][0]=300&fonts[0][weights][1]=500&fonts[0][weights][2]=700" />
    ```
