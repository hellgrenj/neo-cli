/** 
returns the near earth object that passes closest to earth
@param {any} neos - the response object from the NASA NEO API
@returns {number} - the near earth object (parsed from the response)
*/
export const closestToEarth = (neos: any): any => {
  return neos
    ? Object.values(neos).flat()
      .reduce((closest: any, current: any) => {
        return (Math.round(
          closest.close_approach_data[0].miss_distance.kilometers,
        )) <
          Math.round(current.close_approach_data[0].miss_distance.kilometers)
          ? closest
          : current;
      })
    : [];
};
/** 
converts kilometers to scandinavian miles (mil)
@param {number} kilometers
@returns {number} - the scandinavian miles (mil)
*/
export const kilometersToScandinavianMiles = (kilometers: number): number => {
  return Math.round(kilometers / 10);
};
/** 
returns how many times through Sweden one would drive if driving all kilometers
@param {number} kilometers
@returns {number} - number of times through Sweden
*/
export const timesThruSweden = (kilometer: number): number => {
  const lengthOfSwedenInKm = 1572;
  return Math.round(kilometer / lengthOfSwedenInKm);
};
