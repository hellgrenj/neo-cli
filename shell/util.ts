import { readLines } from "https://deno.land/std@v0.58.0/io/bufio.ts";
import * as c from "https://deno.land/std@v0.58.0/fmt/colors.ts";
export const prompt = async (question: string) => {
  await Deno.stdout.write(
    new TextEncoder().encode(c.blue(c.bgBlack(question))),
  );
  for await (const line of readLines(Deno.stdin)) {
    return line;
  }
};
export const printInfo = async (info: string) => {
  await Deno.stdout.write(
    new TextEncoder().encode(c.blue(c.bgBlack(info + "\n"))),
  );
};
export const printWarning = async (info: string) => {
  await Deno.stdout.write(
    new TextEncoder().encode(c.yellow(c.bgBlack(info + "\n"))),
  );
};
export const printHeaderSync = (header: string) => {
  const stars = header.split("").map((c) => "*").join('');
  console.log(stars);
  console.log(header);
  console.log(stars);
};
