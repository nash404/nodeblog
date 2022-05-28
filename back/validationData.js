const functionOfValidation = {
  "morethan100-validation": (data) => {
    return data.text.length > 100
      ? `Too many characters in ${data.nameOfField}`
      : "normal";
  },
  "void-validation": (data) => {
    return data.text.length !== 0 ? "normal" : `Input ${data.nameOfField}`;
  },
  "xss-validation": (data) => {
    let xssSymbols = [
      "<",
      ">",
      "/",
      "[",
      "]",
      "(",
      "{",
      "}",
      ")",
      "*",
      "&",
      "^",
      "%",
      "$",
      "#",
      "?",
      "`",
      "~",
      ":",
    ];
    for (let item of xssSymbols) {
      if (data.text.includes(item)) {
        return `${data.text} has invalid symbols`;
      }
    }

    return "normal";
  },
};

const validation = async (data) => {
  let statusOfErrors = {
    status: true,
    errors: [],
  };

  let keys = Object.keys(data);
  let keysOfValidation = Object.keys(functionOfValidation);

  for (let item of keys) {
    for (let element of keysOfValidation) {
      let resulOfValidation = functionOfValidation[element]({
        text: data[item],
        nameOfField: item,
      });

      if (resulOfValidation !== "normal") {
        statusOfErrors.errors.push({ type: "Error", text: resulOfValidation });
        statusOfErrors.status = false;
        break;
      }
    }
  }

  return statusOfErrors;
};

module.exports = validation;
