const moment = require("moment");

module.exports = {
  getEpochFromDate: (date) => moment(date, "D/M/YYYY H:mm").valueOf(),
};
