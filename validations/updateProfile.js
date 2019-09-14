const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateUpdateProfileInput(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.dateOfBirth = !isEmpty(data.dateOfBirth) ? data.dateOfBirth : "";
  data.hometown = !isEmpty(data.hometown) ? data.hometown : "";
  data.country = !isEmpty(data.country) ? data.country : "";

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First name is required";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last name is required";
  }

  if (Validator.isEmpty(data.dateOfBirth)) {
    errors.dateOfBirtf = "Date of Birth is required";
  }

  if (Validator.isEmpty(data.hometown)) {
    errors.hometown = "Hometown is required";
  }

  if (Validator.isEmpty(data.country)) {
    errors.country = "Country is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
