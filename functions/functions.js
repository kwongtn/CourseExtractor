/**
 * Converts a number to a string with preceeding zeroes.
 * @param {number} num The number to convert
 * @param {number} limit The digits to convert with respect to.
 */
module.exports.numString = (num, limit = 10) => {
    conv = num.toString();
    if(num < limit){
        while (limit > 1) {
            conv = "0" + conv;
            limit = limit / 100;
        }
    }
    return conv;
}
