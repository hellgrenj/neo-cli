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

export const nearEarthObjectsBetweenDates = async () => {
  console.clear();
  console.log(c.gray(`(using API_KEY ${API_KEY})`));
  printHeaderSync(`(a) NEO's between dates`);
  const startDate = Deno.args[0];
  const endDate = Deno.args[1];
  console.log(c.gray(`fetching near earth objects between ${startDate} and ${endDate}`))
  const url =
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
  const res = await fetch(url);
  const response = await res.json();
  if (res.status !== 200) {
    await printWarning("error");
    await printWarning(response.error_message);
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
  console.log("");
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
const printWarning = async (info: string) => {
  await Deno.stdout.write(
    new TextEncoder().encode(c.yellow(c.bgBlack(info + "\n"))),
  );
};
const printHeaderSync = (header: string) => {
  const stars = header.split("").map((_) => "*").join("");
  console.log(stars);
  console.log(header);
  console.log(stars);
};
