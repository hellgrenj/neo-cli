// close_approach_data: [
//   {
//     close_approach_date: "2020-06-21",
//     close_approach_date_full: "2020-Jun-21 19:38",
//     epoch_date_close_approach: 1592768280000,
//     relative_velocity: {
//       kilometers_per_second: "28.3065334883",
//       kilometers_per_hour: "101903.5205577745",
//       miles_per_hour: "63318.8847599127"
//     },
//     miss_distance: {
//       astronomical: "0.4878377293",
//       lunar: "189.7688766977",
//       kilometers: "72979485.208916591",
//       miles: "45347349.3242913158"
//     },
//     orbiting_body: "Earth"
//   }
// ],
export const relativeVelocity = (neo: any): [number, number] => {
  return [
    Math.round(neo.close_approach_data[0].relative_velocity.kilometers_per_second),
    Math.round(neo.close_approach_data[0].relative_velocity.kilometers_per_hour),
  ];
};
