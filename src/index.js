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
 * @param {String|Array} data The data to set.
 * @param {Number} expiresIn Time in second to expire the key.
 * @returns {Promise<String>}
 */
Cache.prototype.set = async function (key, data, expiresIn = 0) {
  try {
    if (expiresIn > 0) {
      return await this.client.setAsync(key, data, 'EX', expiresIn);
    }
    return await this.client.setAsync(key, data);
  } catch (err) {
    this.log.error('Error setting cache with key "%s"', key);
    this.log.error({ err });

    return void 0;
  }
};

/**
 * Set an object in the cache.
 *
 * @param {String} key The key.
 * @param {Object} data The data to set.
 * @returns {Promise<Number>}
 */
Cache.prototype.seth = async function (key, data, expiresIn = 0) {
  try {
    const st = await this.client.hsetAsync(key, ...Object.entries(data));
    if (st > 0 && expiresIn > 0) {
      await this.client.expireAsync(key, expiresIn);
    }
    return st;
  } catch (err) {
    this.log.error('Error setting hash cache with key "%s"', key);
    this.log.error({ err });

    return void 0;
  }
};

/**
 * Get the value of a key.
 *
 * @param {String} key - The key to retrieve.
 * @returns {Promise<Object>}
 */
Cache.prototype.get = async function (key) {
  try {
    return await this.client.getAsync(key);
  } catch (err) {
    this.log.error('Error retrieving key "%s"', key);
    this.log.error({ err });

    return void 0;
  }
};

/**
 * Get the entire hash value stored at key.
 *
 * @param {String} key - The hash to retrieve.
 * @returns {Promise<Object>}
 */
Cache.prototype.getallh = async function (key) {
  try {
    return await this.client.hgetallAsync(key);
  } catch (err) {
    this.log.error('Error retrieving hash "%s"', key);
    this.log.error({ err });

    return void 0;
  }
};

/**
 * Get a single filed of an hash stored at key.
 *
 * @param {String} key - The hash to retrieve.
 * @param {String} field - The hash field to retrieve.
 * @returns {Promise<String>}
 */
Cache.prototype.geth = async function (key, field) {
  try {
    return await this.client.hgetAsync(key, field);
  } catch (err) {
    this.log.error('Error retrieving field "%s" of "%s"', field, key);
    this.log.error({ err });

    return void 0;
  }
};

/**
 * Delete a key from the cache.
 * @param {String} key - The key to remove.
 * @returns {Promise<Number>}
 */
Cache.prototype.del = async function (key) {
  try {
    return await this.client.delAsync(key);
  } catch (err) {
    this.log.error('Error removing key "%s"', key);
    this.log.error({ err });

    return void 0;
  }
};

/**
 * Append the provided data to the list.
 * @param {String} key - The name of the list to set data.
 * @param {String|Buffer|Array} data - The data to append to the list.
 * @param {Number} [expiresIn=0] - Key expiration in seconds.
 * @returns {Promise<Number>}
 */
Cache.prototype.rpush = async function (key, data, expiresIn = 0) {
  try {
    const st = await this.client.rpushAsync(key, data);
    if (expiresIn > 0) {
      await this.client.expireAsync(key, expiresIn);
    }
    return st;
  } catch (err) {
    this.log.error('Error appending list data for key "%s"', key);
    this.log.error({ err });

    return void 0;
  }
};

/**
 * Trim a list so that it contains only a certain number of elements.
 * @param {String} key - The name of the list to set data.
 * @param {Number} start - The start index.
 * @param {Number} stop - The end index.
 * @returns {Promise<Array>}
 */
Cache.prototype.ltrim = async function (key, start, stop) {
  try {
    return await this.client.ltrimAsync(key, start, stop);
  } catch (err) {
    this.log.error('Error trimming list data for key "%s"', key);
    this.log.error({ err });

    return void 0;
  }
};

/**
 * Retrieve values from a list.
 * @param {String} key - The key of the list to retrieve.
 * @param {Number} [start=0] - The start index in the list.
 * @param {Number} [stop=-1] - The stop index in the list.
 * @returns {Promise<Array>}
 */
Cache.prototype.lrange = async function (key, start = 0, stop = -1) {
  try {
    return await this.client.lrangeAsync(key, start, stop);
  } catch (err) {
    this.log.error('Error retrieving list for key "%s"', key);
    this.log.error({ err });

    return void 0;
  }
};

let cache;

export function getCache(client, log) {
  if (!cache) {
    cache = new Cache(client, log);
  }

  return cache;
}

export default getCache;
