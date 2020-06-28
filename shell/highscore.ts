export const FILE_PATH_NAME = "./highscore.json";
export const load = async () => {
  if (await exists(FILE_PATH_NAME)) {
    const json = await Deno.readFile(FILE_PATH_NAME);
    return JSON.parse(new TextDecoder().decode(json));
  } else {
    return null;
  }
};
export const save = async (highscore: any) => {
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
