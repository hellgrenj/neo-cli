import * as c from "https://deno.land/std@v0.58.0/fmt/colors.ts";
import { closestToEarth } from "../core/distance/mod.ts";
import { createReport } from "../core/report/mod.ts";
import { checkHighscore } from "./highscore.ts";

const API_KEY = Deno.env.get("API_KEY") ? Deno.env.get("API_KEY") : "DEMO_KEY";

export const run = async () => {
  const option = Deno.args[0];
  switch (option) {
    case "--between-dates":
      await nearEarthObjectsBetweenDates();
      break;
    case "--help":
      console.log(
        "pass in arguments --between-dates <startDate in YYYY-MM-DD> <endDate in YYYY-MM-DD>",
      );
      Deno.exit(0);
    default:
      console.log(`the only supported arguments are --between-dates and --help
        `);
      Deno.exit(1);
  }
};
export const nearEarthObjectsBetweenDates = async () => {
  console.clear();
  console.log(
    c.gray(
      `(${
        API_KEY == "DEMO_KEY"
          ? "using demo API key"
          : "using API key from env variable"
      })`,
    ),
  );
  const startDate = Deno.args[1];
  const endDate = Deno.args[2];
  const response = await fetchNearEarthObjects(startDate, endDate);
  console.log(createReport(response));
  const closest = closestToEarth(response.near_earth_objects);
  await checkHighscore(closest);
};
const fetchNearEarthObjects = async (startDate: string, endDate: string) => {
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
  return response;
};
