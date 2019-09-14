const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateChangePasswordInput(data) {
  let errors = {};
  const regularExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;

  data.userName = !isEmpty(data.userName) ? data.userName : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : '';

  if (Validator.isEmpty(data.userName)) {
    errors.userName = 'Username is required';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 16 })) {
    errors.password = 'Password must be at least 6 charactes';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.matches(data.password, regularExpression)) {
    errors.password =
      'The password must contain at least one number, one uppercase and one lowercase letter';
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = 'Password must match';
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = 'Confirm password field is required';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
