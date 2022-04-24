const notFound = (req, res, next) => {
  const error = new Error(`Route - ${req.originalUrl} - does not exist`);
  res.status(404);
  next(error);
};

export default notFound;
