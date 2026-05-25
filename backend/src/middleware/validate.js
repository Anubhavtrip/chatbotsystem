function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const err = new Error('Validation failed');
      err.statusCode = 400;
      err.errors = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));
      return next(err);
    }

    req[source] = value;
    next();
  };
}

module.exports = validate;
