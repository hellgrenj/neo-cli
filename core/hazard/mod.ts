import { NearEarthObject } from "../_types/nearEarthObject.ts";

/** 
returns number of hazardous objects 
@param {any} apiResponseObject - the response object from the NASA NEO API
@returns {number} - number of hazardous objects
*/
export const numberOfHazardousObjects = (apiResponseObject: any): number => {
  const neos = apiResponseObject
    ? Object.values(apiResponseObject).flat() as NearEarthObject[]
    : [] as NearEarthObject[];
  return neos.filter((n: any) => n.is_potentially_hazardous_asteroid).length;
};
/** 
checks wether or not a near earth object is considered hazardouz
@param {NearEarthObject} nearEarthObject - the near earth object
@returns {boolean} - hazardous or not
*/
export const consideredPotentiallyHazardous = (
  nearEarthObject: NearEarthObject,
): boolean => {
  return nearEarthObject.is_potentially_hazardous_asteroid;
};
