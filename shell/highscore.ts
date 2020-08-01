import { NearEarthObject } from "../core/_types/nearEarthObject.ts";
import { closerThanHighscore } from "../core/distance/mod.ts";
import * as c from "https://deno.land/std@v0.58.0/fmt/colors.ts";
import * as path from "https://deno.land/std@0.57.0/path/mod.ts";

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const FILE_PATH_NAME = `${__dirname}/highscore.json`;
export const checkHighscore = async (
  closestNearEarthObjectInResponse: NearEarthObject,
) => {
  const currHighscore = await load();
  if (currHighscore) {
    const newTitleHolder = closerThanHighscore(
      closestNearEarthObjectInResponse,
      currHighscore,
    );
    if (newTitleHolder) {
      console.log(
        c.gray(
          `(this is the closest NEO you have ever fetched, updating ${FILE_PATH_NAME}`,
        ),
      );
      await save(closestNearEarthObjectInResponse);
    }
  } else {
    // first execution
    await save(closestNearEarthObjectInResponse);
  }
};
const load = async () => {
  if (await exists(FILE_PATH_NAME)) {
    const json = await Deno.readFile(FILE_PATH_NAME);
    return JSON.parse(new TextDecoder().decode(json));
  } else {
    return null;
  }
};
const save = async (highscore: any) => {
  const json = JSON.stringify(highscore);
  await Deno.writeFile(FILE_PATH_NAME, new TextEncoder().encode(json));
};
const exists = async (filename: string): Promise<boolean> => {
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
};
