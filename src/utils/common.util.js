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

  createMessage: (name) => {
    return `${name} was created successfully`;
  },

  getMessage: (name) => {
    return `${name} was get successfully`;
  },
};
