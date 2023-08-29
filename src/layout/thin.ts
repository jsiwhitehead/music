export default (blocks) => {
  const thin1 = blocks && blocks[0]?.[0] === blocks[0]?.[1];
  const thin2 = blocks && blocks[1]?.[0] === blocks[1]?.[1];
  return [
    blocks[0] && [
      blocks[0][0] - (thin1 ? 0.25 : 0),
      blocks[0][1] + (thin1 ? 0.25 : 0),
    ],
    blocks[1] && [
      blocks[1][0] - (thin2 ? 0.25 : 0),
      blocks[1][1] + (thin2 ? 0.25 : 0),
    ],
  ];
};
