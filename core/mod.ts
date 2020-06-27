interface distance {
  kilometers: number;
  scandinavian_miles: number;
}

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

export const closestToEarth = (neos: any): distance => {
  const distances_in_km = neos
    ? Object.values(neos).flat().map((n: any) => n.close_approach_data).flat()
      .map((c) => c.miss_distance.kilometers)
    : [];
  const distance_in_km = Math.min(...distances_in_km);
  return {
    kilometers: Math.round(distance_in_km),
    scandinavian_miles: kmToScandinavianMiles(distance_in_km),
  };
};
const kmToScandinavianMiles = (kilometers: number): number => {
  return Math.round(kilometers / 10);
};
export const timesThruSweden = (kilometer: number): number => {
  const lengthOfSwedenInKm = 1572;
  return Math.round(kilometer / lengthOfSwedenInKm);
};
