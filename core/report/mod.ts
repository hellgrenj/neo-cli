import {
  kilometersToScandinavianMiles,
  timesThruSweden,
  closestToEarth,
} from "../distance/mod.ts";
import { estimatedDiameterInMeters } from "../size/mod.ts";
import { relativeVelocity } from "../velocity/mod.ts";
import * as c from "https://deno.land/std@v0.58.0/fmt/colors.ts";
import {
  numberOfHazardousObjects,
  consideredPotentiallyHazardous,
} from "../hazard/mod.ts";


/** 
takes a response from the NEO WS API and returns a report
@param {any} response - the API Response
@returns {[string, NearEarthObject]} - the report 
*/
export const createReport = (
  response: any,
): string => {
  const closest = closestToEarth(response.near_earth_objects);

  const closestDistanceInKm = Math.round(
    closest.close_approach_data[0].miss_distance
      .kilometers,
  );
  const [minDia, maxDia] = estimatedDiameterInMeters(
    closest,
  );
  const [kmPerSecond, kmPerHour] = relativeVelocity(
    closest,
  );

  return `In total ${
    c.green(response.element_count.toString())
  } objects where found and ${
    c.red(
      numberOfHazardousObjects(
        response.near_earth_objects,
      ).toString(),
    )
  } where considered hazardous.
        
The closest one passed just ${
    c.yellow(
      formatNumberString(closestDistanceInKm),
    )
  } km from earth (${
    c.yellow(
      formatNumberString(kilometersToScandinavianMiles(
        closestDistanceInKm,
      )),
    )
  } scandinavian miles)
thats like driving thru Sweden ${
    c.green(timesThruSweden(closestDistanceInKm).toString())
  } times
        
its estimated to be between ${c.green(minDia.toString())} and ${
    c.green(maxDia.toString())
  } meters in diameter travelling at a speed (relative to us) 
of ${c.yellow(formatNumberString(kmPerSecond))} km per second (${
    c.yellow(formatNumberString(kmPerHour))
  } km per hour)
        
this object (the closest one) is ${
    consideredPotentiallyHazardous(closest) ? c.red("(!)") : c.green("NOT")
  } considered potentially hazardous
        `.trim();
};
const formatNumberString = (n: number): string => {
  return n.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
};
