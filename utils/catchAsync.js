module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next); // next is the error handler function, which will be called if any error occurs.
  };
};
