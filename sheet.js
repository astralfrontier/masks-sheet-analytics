const neatCsv = require("neat-csv");

const TRUE = "TRUE";

// "slot" is a number from 0-4, for the corresponding PC
const sheetForCharacter = (data, slot) => {
  const col = 5 * slot;
  return {
    name: data[1][col],
    playbook: data[3][col + 1],
    danger: parseInt(data[10][col + 1]),
    freak: parseInt(data[11][col + 1]),
    savior: parseInt(data[12][col + 1]),
    superior: parseInt(data[13][col + 1]),
    mundane: parseInt(data[14][col + 1]),
    angry: data[17][col + 1] == TRUE,
    afraid: data[18][col + 1] == TRUE,
    guilty: data[19][col + 1] == TRUE,
    hopeless: data[20][col + 1] == TRUE,
    insecure: data[21][col + 1] == TRUE
  };
};

const readSheet = async text => {
  const data = await neatCsv(text, { headers: false });
  return data;
};

module.exports = {
  sheetForCharacter,
  readSheet
};
