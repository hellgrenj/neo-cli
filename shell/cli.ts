import * as c from "https://deno.land/std@v0.58.0/fmt/colors.ts";
import {
  numberOfHazardousObjects,
  consideredPotentiallyHazardous,
} from "../core/hazard/mod.ts";
import {
  closestToEarth,
  kilometersToScandinavianMiles,
} from "../core/distance/mod.ts";
import { timesThruSweden } from "../core/distance/mod.ts";
import { estimatedDiameterInMeters } from "../core/size/mod.ts";
import { relativeVelocity } from "../core/velocity/mod.ts";

const API_KEY = Deno.env.get("API_KEY") ? Deno.env.get("API_KEY") : "DEMO_KEY";

export const run = async () => {
  const option = Deno.args[0];
  switch (option) {
    case "--between-dates":
      await nearEarthObjectsBetweenDates();
      break;
    case "--help":
      console.log(
        "pass in arguments --between-date <startDate in YYYY-MM-DD> <endDate in YYYY-MM-DD>",
      );
      Deno.exit(0);
    default:
      console.log(`only supported arguments are --between-dates and --help
        `);
      Deno.exit(1);
  }
};
export const nearEarthObjectsBetweenDates = async () => {
  console.clear();
  console.log(c.gray(`(using API_KEY ${API_KEY})`));
  const startDate = Deno.args[1];
  const endDate = Deno.args[2];
  console.log(
    c.gray(`fetching near earth objects between ${startDate} and ${endDate}`),
  );
  const url =
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
  const res = await fetch(url);
  const response = await res.json();
  if (res.status !== 200) {
    console.error("error");
    console.error(response.error_message);
    console.log(res);
    Deno.exit();
  }

  const closestNearEarthObjectInResponse = closestToEarth(
    response.near_earth_objects,
  );
  const closestDistanceInKm = Math.round(
    closestNearEarthObjectInResponse.close_approach_data[0].miss_distance
      .kilometers,
  );
  const [minDia, maxDia] = estimatedDiameterInMeters(
    closestNearEarthObjectInResponse,
  );
  const [kmPerSecond, kmPerHour] = relativeVelocity(
    closestNearEarthObjectInResponse,
  );
  console.log(
    `In total ${
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
        printPrettyNumber(closestDistanceInKm),
      )
    } km from earth (${
      c.yellow(
        printPrettyNumber(kilometersToScandinavianMiles(
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
of ${c.yellow(printPrettyNumber(kmPerSecond))} km per second (${
      c.yellow(printPrettyNumber(kmPerHour))
    } km per hour)
    
this object (the closest one) is ${
      consideredPotentiallyHazardous(closestNearEarthObjectInResponse)
        ? c.red("(!)")
        : c.green("NOT")
    } considered potentially hazardous
    `.trim(),
  );
};

const printPrettyNumber = (n: number): string => {
  return n.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
};
