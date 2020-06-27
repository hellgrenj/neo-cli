/** 
returns number of hazardous objects 
@param {any} neos - the response object from the NASA NEO API
*/
export const numberOfHazardousObjects = (neos: any): number => {
  return neos
    ? Object.values(neos).flat().filter((n: any) =>
      n.is_potentially_hazardous_asteroid
    ).length
    : 0;
};
export const consideredPotentiallyHazardous = (nearEarthObject: any) : boolean => {
    return nearEarthObject.is_potentially_hazardous_asteroid
}