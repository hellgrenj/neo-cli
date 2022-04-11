import { NearEarthObject } from "../_types/nearEarthObject.ts";
import { APIResponse } from "../_types/apiResponseObject.ts";


export const pipe = (...fns: Function[]) => {
  return <T>(result: T) => {
    return [...fns].reduce((result, fn) => {
      return fn(result);
    }, result);
  };
};

export const extractNeos = (apiResponse: APIResponse): NearEarthObject[] => {
  return apiResponse
    ? Object.values(apiResponse).flat() as NearEarthObject[]
    : [] as NearEarthObject[];
};
