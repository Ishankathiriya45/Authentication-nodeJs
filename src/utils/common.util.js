const constants = require("../constants");

const isEmpty = (value) => {
  if (value === undefined) return true;

  if (value === null || value.length === 0) return true;

  if (typeof value === "object") {
    let result = true;
    if (Object.keys(value) == "" || Object.keys(value).length > 0) {
      result = false;
    }
    return result;
  }

  if (typeof value === "string") {
    if (
      value.trim() === "" ||
      value == "null" ||
      value == "undefine" ||
      value == "0" ||
      value == "NaN"
    ) {
      return true;
    }
  }
};

module.exports = {
  isEmpty,

  getDynamicContent: (contentKey, messageData, contentResource) => {
    const resource = constants[contentResource];
    let content = resource[contentKey];
    if (!isEmpty(content) && !isEmpty(messageData)) {
      for (const key in messageData) {
        content = content.replaceAll(`[${key}]`, messageData[key]);
      }
    }
    return content;
  },

  createMessage: (name) => {
    return `${name} was created successfully`;
  },

  getMessage: (name) => {
    return `${name} was get successfully`;
  },
};
