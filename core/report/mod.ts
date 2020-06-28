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
import { NearEarthObject } from "../_types/nearEarthObject.ts";
import { pipe } from "../util/mod.ts";

interface Report {
  response: any;
  closest: NearEarthObject;
  closestDistanceInKm: number;
  minDia: number;
  maxDia: number;
  kmPerSecond: number;
  kmPerHour: number;
}
/** 
takes a response from the NEO WS API and returns a report
@param {any} response - the API Response
@returns {[string, NearEarthObject]} - the report 
*/
export const createReport = (
  response: any,
): string => {
  return pipe(constructReport, formatReport)(response);
};

const constructReport = (response: any): Report => {
  const closest = closestToEarth(response.near_earth_objects);

  const closestDistanceInKm = Math.round(
    closest.close_approach_data[0].miss_distance.kilometers,
  );
  const [minDia, maxDia] = estimatedDiameterInMeters(
    closest,
  );
  const [kmPerSecond, kmPerHour] = relativeVelocity(
    closest,
  );
  return {
    response,
    closest,
    closestDistanceInKm,
    minDia,
    maxDia,
    kmPerSecond,
    kmPerHour,
  } as Report;
};
const formatReport = (
  report: Report,
): string => {
  return `In total ${
    c.green(report.response.element_count.toString())
  } objects where found and ${
    c.red(
      numberOfHazardousObjects(
        report.response.near_earth_objects,
      ).toString(),
    )
  } where considered hazardous.
            
The closest one passed just ${
    c.yellow(
      formatNumberString(report.closestDistanceInKm),
    )
  } km from earth (${
    c.yellow(
      formatNumberString(kilometersToScandinavianMiles(
        report.closestDistanceInKm,
      )),
    )
  } scandinavian miles)
thats like driving thru Sweden ${
    c.green(formatNumberString(timesThruSweden(report.closestDistanceInKm)))
  } times
            
its estimated to be between ${c.green(report.minDia.toString())} and ${
    c.green(report.maxDia.toString())
  } meters in diameter travelling at a speed (relative to us) 
of ${c.yellow(formatNumberString(report.kmPerSecond))} km per second (${
    c.yellow(formatNumberString(report.kmPerHour))
  } km per hour)
            
this object (the closest one) is ${
    consideredPotentiallyHazardous(report.closest)
      ? c.red("(!)")
      : c.green("NOT")
  } considered potentially hazardous
            `.trim();
};
const formatNumberString = (n: number): string => {
  return n.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
};
