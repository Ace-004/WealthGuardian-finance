const errorHandler = (err, req, res, next) => {
  const status = err.status || 400;
  const message = err.message || "Unexpected error";
  if (process.env.NODE_ENV !== "test") console.error(err);
  res.status(status).json({ status, message });
};

module.exports = errorHandler;
