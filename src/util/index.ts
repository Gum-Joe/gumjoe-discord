/**
 * Utils to help handle Map objects
 */

export function mapValsToList(map: Map<any, any>): any[] {
  const returnArray: any[] = [];
  for (var [key, value] of map) {
    returnArray.push(value);
  }
  return returnArray;
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}