/**
 * Converts a number to a string with preceeding zeroes.
 * @param {number} num The number to convert
 * @param {number} limit The digits to convert with respect to.
 */
module.exports.numString = (num, limit = 10) => {
    conv = num.toString();
    if (num < limit) {
        while (limit > 1) {
            conv = "0" + conv;
            limit = limit / 100;
        }
    }
    return conv;
}

/**
 * Runs the promises one by one, waiting it to solve before running the next.
 * Source: https://stackoverflow.com/questions/24586110/resolve-promises-one-after-another-i-e-in-sequence
 * @param {array} objects_array The array of objects to be iterated across.
 * @param {function} iterator Function to run across the iterations.
 * @param {callback} callback
 * @return {Promise[]}
 */
module.exports.one_by_one = (objects_array, iterator, callback) => {
    var start_promise = objects_array.reduce((prom, object) => {
        return prom.then(() => {
            return iterator(object);
        });
    }, Promise.resolve()); // initialize with a resolved promise

    if (callback) {
        start_promise.then(callback);
    } else {
        return start_promise;
    }
}