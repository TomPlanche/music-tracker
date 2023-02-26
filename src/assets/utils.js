/**
 * @file src/assets/utils.js
 * @description Utility functions
 * @license: Unilicense
 **********************/

// IMPORTS =========================================================    IMPORTS
// END IMPORTS ===================================================  END IMPORTS

// VARIABLES ======================================================   VARIABLES

// END VARIABLES ================================================ END VARIABLES

// FUNCTIONS ======================================================   FUNCTIONS
/**
 * @function calcWinSize
 * @description Calculates the window size
 *
 * @returns {{width: number, height: number}}
 */
const calcWinSize = () => {
    return {width: window.innerWidth, height: window.innerHeight};
};

/**
 * @function getMousePos
 * @description Get the mouse position.
 *
 * @param e - The mouse event.
 *
 * @returns {{x: number, y: number}}
 */
const getMousePos = e => {
	return {
		x: e.clientX,
		y: e.clientY
	};
};

/**
 * @function distanceBetweenPoints
 * @description Returns the distance between two points.
 *
 * @param x1 {number} The x coordinate of the first point.
 * @param y1 {number} The y coordinate of the first point.
 * @param x2 {number} The x coordinate of the second point.
 * @param y2 {number} The y coordinate of the second point.
 *
 * @returns {number} The distance between the two points rounded to 2 decimals.
 */
const distanceBetweenPoints = (
	x1,
	y1,
	x2,
	y2
) => {
	const a = x1 - x2;
	const b = y1 - y2;

	return +Math.sqrt(a * a + b * b).toFixed(2);
};


/**
 * @function lineEq
 * @description Returns the equation of a line (y = ax + b).
 *
 * @param y2 {number} The y coordinate of the second point.
 * @param y1 {number} The y coordinate of the first point.
 * @param x2 {number} The x coordinate of the second point.
 * @param x1 {number} The x coordinate of the first point.
 * @param currentVal {number} The current value.
 *
 * @returns {number} The value of the line equation.
 */
const lineEq = (
	y2,
	y1,
	x2,
	x1,
	currentVal
) => {
	const
		a = (y2 - y1) / (x2 - x1),
		b = y1 - a * x1;
	return a * currentVal + b;
};

/**
 * @function lerp
 * @description Returns the linear interpolation of two values.
 *
 * @param a {number} The first value.
 * @param b {number} The second value.
 * @param n {number} The interpolation value.
 *
 * @returns {number} The linear interpolation.
 */
const lerp = (a, b, n) => (1 - n) * a + n * b;

/**
 * Sample
 *
 * Returns a random element from the array.
 *
 * @returns {*} Random element from the array
 */
// no-extend-native - https://eslint.org/docs/rules/no-extend-native
Array.prototype.sample = function() {
  return this[Math.floor(Math.random()*this.length)];
}

/**
 * @function verifyIsInBounds
 * @description Verify if the mouse is in the bounds.
 *
 * @param mousepos - {x: number, y: number} - The mouse position.
 * @param rect - {left: number, top: number, width: number, height: number} - The bounds.
 * @param boundsExtention - {number} - The bounds extention.
 *
 * @returns {boolean} - True if the mouse is in the bounds.
 */
const verifyIsInBounds = (
    mousepos,
    rect,
    boundsExtention = 1
) => {
    return mousepos.x >= rect.right - (rect.width * boundsExtention) &&
        mousepos.x <= rect.left + (rect.width * boundsExtention)     &&
        mousepos.y >= rect.bottom - (rect.height * boundsExtention)  &&
        mousepos.y <= rect.top + (rect.height * boundsExtention);
}
// END FUNCTIONS ================================================ END FUNCTIONS

export {
	calcWinSize,
	distanceBetweenPoints,
	getMousePos,
	lineEq,
	lerp,
	verifyIsInBounds
}

/**
 * End of file src/assets/utils.js
 */
