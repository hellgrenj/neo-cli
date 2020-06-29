import {
  kilometersToScandinavianMiles,
  timesThruSweden,
  closestToEarth,
  closeApproachFullDate,
} from "../distance/mod.ts";
import { estimatedDiameterInMeters } from "../size/mod.ts";
import { relativeVelocity } from "../velocity/mod.ts";
import * as c from "https://deno.land/std@v0.58.0/fmt/colors.ts";
import {
  numberOfHazardousObjects,
  consideredPotentiallyHazardous,
} from "../hazard/mod.ts";
import { pipe } from "../util/mod.ts";

interface Report {
  closestDistanceInKm: number;
  minDia: number;
  maxDia: number;
  kmPerSecond: number;
  kmPerHour: number;
  closeApproachDate: string;
  scandinavanMiles: number;
  timesSwedensLength: number;
  hazardous: boolean;
  noHazardous: number;
  noObjects: number;
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
  const closeApproachDate = closeApproachFullDate(closest);
  const scandinavanMiles = kilometersToScandinavianMiles(closestDistanceInKm);
  const timesSwedensLength = timesThruSweden(closestDistanceInKm);
  const hazardous = consideredPotentiallyHazardous(closest);
  const noHazardous = numberOfHazardousObjects(response.near_earth_objects);
  const noObjects = response.element_count;

  return {
    closestDistanceInKm,
    minDia,
    maxDia,
    kmPerSecond,
    kmPerHour,
    closeApproachDate,
    scandinavanMiles,
    timesSwedensLength,
    hazardous,
    noHazardous,
    noObjects,
  } as Report;
};
const formatReport = (
  report: Report,
): string => {
  return `In total ${
    c.green(report.noObjects.toString())
  } objects where found and ${
    c.red(report.noHazardous.toString())
  } where considered hazardous.
            
The closest one passed/will pass just ${
    c.yellow(
      formatNumberString(report.closestDistanceInKm),
    )
  } km from earth (${
    c.yellow(
      formatNumberString(report.scandinavanMiles),
    )
  } scandinavian miles)
thats like driving thru Sweden ${
    c.green(formatNumberString(report.timesSwedensLength))
  } times.

Date and time for this close approach is ${
    c.cyan(report.closeApproachDate)
  }
            
This object is estimated to be between ${
    c.green(report.minDia.toString())
  } and ${
    c.green(report.maxDia.toString())
  } meters in diameter travelling at a speed (relative to us) 
of ${c.yellow(formatNumberString(report.kmPerSecond))} km per second (${
    c.yellow(formatNumberString(report.kmPerHour))
  } km per hour)
            
This object is ${
    report.hazardous ? c.red("(!)") : c.green("NOT")
  } considered potentially hazardous
            `.trim();
};
const formatNumberString = (n: number): string => {
  return n.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
};
