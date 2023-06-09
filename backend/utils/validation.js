// backend/utils/validation.js
const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const handleValidationErrorsSpots = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()) {
    const errors = validationErrors
    .array()
    .map((error) => `${error.msg}`);

    const err = Error('Validation Error');
    err.errors = errors;
    err.status = 400;
    err.title = 'Validation Error';
    next(err);
  }
  next();
}

const handleValidationErrorsBookings = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if(!validationErrors.isEmpty()) {
    const errors = validationErrors
    .array()
    .map((error) => `${error.msg}`);

    const err = Error('Validation Error');
    err.errors = errors;
    err.statusCode = 403;
    err.title = 'Validation Error'
    next(err);
  }
  next();
}

module.exports = {
  handleValidationErrors, handleValidationErrorsBookings, handleValidationErrorsSpots
};
