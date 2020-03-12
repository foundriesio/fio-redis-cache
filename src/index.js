class Cache {
  constructor(client, log) {
    this.client = client;
    this.log = log;
  }
}

/**
 * Set some data into the cache.
 *
 * @param {String} key The key.
 * @param {(String, Array)} data The data to set.
 * @param {Number} expiresIn Time in second to expire the key.
 */
Cache.prototype.set = function(key, data, expiresIn = 0) {
  process.nextTick(async () => {
    try {
      const st = await this.client.setnxAsync(key, data);
      if (st === 1 && expiresIn > 0) {
        await this.client.expireAsync(key, expiresIn);
      }
    } catch (err) {
      this.log.error('Error setting cache with key', key);
      this.log.error(err);
    }
  });
};

/**
 * Set an object in the cache.
 *
 * @param {String} key The key.
 * @param {Object} data The data to set.
 */
Cache.prototype.seth = async function(key, data, expiresIn = 0) {
  process.nextTick(async () => {
    try {
      await this.client.hmsetAsync(key, data);
      if (expiresIn > 0) {
        await this.client.expireAsync(key, expiresIn);
      }
    } catch (err) {
      this.log.error('Error setting hash cache with key', key);
      this.log.error(err);
    }
  });
};

/**
 * Get the value of a key.
 *
 * @param {String} key The key to retrieve.
 * @returns {Promise} The key value.
 */
Cache.prototype.get = async function(key) {
  try {
    return await this.client.getAsync(key);
  } catch (err) {
    this.log.error('Error retrieving key', key);
    this.log.error(err);

    return null;
  }
};

/**
 * Get the entire hash value stored at key.
 *
 * @param {String} key The hash to retrieve.
 * @returns {Object} The hash value.
 */
Cache.prototype.getallh = async function(key) {
  try {
    return await this.client.hgetallAsync(key);
  } catch (err) {
    this.log.error('Error retrieving hash', key);
    this.log.error(err);

    return null;
  }
};

/**
 * Get a single filed of an hash stored at key.
 *
 * @param {String} key The hash to retrieve.
 * @param {String} field The hash field to retrieve.
 * @returns {String} The field value.
 */
Cache.prototype.geth = async function(key, field) {
  try {
    return await this.client.hgetAsync(key, field);
  } catch (err) {
    this.log.error(`Error retrieving field ${field} of ${key}`);
    this.log.error(err);

    return null;
  }
};

/**
 * Delete a key from the cache.
 */
Cache.prototype.del = function(key) {
  process.nextTick(async () => {
    try {
      await this.client.delAsync(key);
    } catch (err) {
      this.log.error(`Error removing key ${key}`);
      this.log.error(err);
    }
  });
};

let cache;

export function getCache(client, log) {
  if (!cache) {
    cache = new Cache(client, log);
  }

  return cache;
}

export default getCache;
