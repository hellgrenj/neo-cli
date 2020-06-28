/** 
returns number of hazardous objects 
@param {any} neos - the response object from the NASA NEO API
@returns {number} - number of hazardous objects
*/
export const numberOfHazardousObjects = (neos: any): number => {
  return neos
    ? Object.values(neos).flat().filter((n: any) =>
      n.is_potentially_hazardous_asteroid
    ).length
    : 0;
};
/** 
checks wether or not a near earth object is considered hazardouz
@param {any} nearEarthObject - the near earth object
@returns {boolean} - hazardous or not
*/
export const consideredPotentiallyHazardous = (
  nearEarthObject: any,
): boolean => {
  return nearEarthObject.is_potentially_hazardous_asteroid;
};
