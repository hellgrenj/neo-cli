import { prompt, printWarning, printInfo, printHeaderSync } from "./util.ts";
import { numberOfHazardousObjects } from "../core/mod.ts";
import { closestToEarth } from "../core/mod.ts";
import { timesThruSweden } from "../core/mod.ts";
import * as c from "https://deno.land/std@v0.58.0/fmt/colors.ts";

/** displays the CLI menu */
export const displayMenu = async () => {
  const menu = `
 What do you want to do?
    
A) fetch neo's between dates and see some cool stats
B) Something else
    
(Select by entering the letter and hit enter)
`;
  console.clear();
  printHeaderSync('Welcome to the NearEarth object CLI!')
  const action = await prompt(menu);

  if (action?.toLocaleLowerCase() === "a") {
    await nearEarthObjectsBetweenDates();
  } else {
    await printWarning("not implemented yet!");
    await printInfo("exiting now..");
    Deno.exit();
  }
};

const nearEarthObjectsBetweenDates = async () => {
  console.clear();
  printHeaderSync(`(a) NEO's between dates`)
  const startDate = await prompt("Enter start date:");
  const endDate = await prompt("Enter end date (limit 7 days):");
  const url =
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=DEMO_KEY`;
  const res = await fetch(url);
  const response = await res.json();
  console.log(Deno.inspect(response, {depth:10}))
  if (res.status !== 200) {
    await printWarning("error");
    await printWarning(response.error_message);
    Deno.exit();
  }
  console.log(response.element_count, c.green("objects found! iscobjeh.."));
  console.log(
    `number of hazardous objects is ${
      numberOfHazardousObjects(response.near_earth_objects)
    }`,
  );
  const closestDistance = closestToEarth(response.near_earth_objects);
  console.log(
    `closest to earth was ${closestDistance.kilometers} km, ${closestDistance.scandinavian_miles} scandinavian miles`,
  );
  console.log(
    `thats like driving thru Sweden ${
      timesThruSweden(closestDistance.kilometers)
    } times`,
  );
};
