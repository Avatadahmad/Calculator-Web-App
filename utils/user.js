const moment = require("moment");
// Result values to display with username and time
function formatMessage(userName, text) {
  return {
    userName,
    text,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
