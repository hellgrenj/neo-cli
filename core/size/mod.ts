export const estimatedDiameterInMeters = (neo: any): [number, number] => {
  return [
    Math.round(neo.estimated_diameter.meters.estimated_diameter_min),
    Math.round(neo.estimated_diameter.meters.estimated_diameter_max),
  ];
};
