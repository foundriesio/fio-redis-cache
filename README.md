A redis-based cache for \*.foundries.io web applications.

It's based on the [@foundriesio/redis-client](https://www.npmjs.com/package/@foundriesio/redis-client) package.

```JavaScript
import redisCache from '@foundriesio/redis-cache';

import redisClient from 'redis-client'; // Propvide a valid redis client
import log from 'log'; // Provide a valid logger function

return redisCache(redisClient, log);
```
