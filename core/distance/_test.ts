import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { kilometersToScandinavianMiles, timesThruSweden } from "./mod.ts";

Deno.test("10 kilometers equals 1 scandinavian mile", () => {
  const kilometers = 10;
  const scandinavianMiles = kilometersToScandinavianMiles(kilometers);
  assertEquals(scandinavianMiles, 1);
});

Deno.test("200 000 kilometers equals 127 times driving thru Sweden", () => {
  const kilometers = 200000;
  const trips = timesThruSweden(kilometers);
  assertEquals(trips, 127);
});
