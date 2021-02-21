const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "SequelizeValidationError":
      let error = [];
      err.errors.map((err) => {
        return error.push(err.message);
      });
      res.status(400).json({ errors: error });
      break;
    case "ResourceNotFound":
      res.status(404).json({ errors: [err.name] });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ errors: ["Email already registered"] });
      break;
    // case "InvalidUser" || "please login first":
    //     res.status(401).json({ errors: [ "Please Login First" ] })
    //     break;
    // case "SequelizeDatabaseError":
    //   res.status(400).json({ errors: [err.name] });
    //   break;
    case "invalidEmailPassword":
      res.status(401).json({ errors: ["invalidEmailPassword"] });
      break;
    case "unauthorize":
      res.status(401).json({ errors: ["unauthorize"] });
      break;
    default:
      res.status(500).json({ errors: ['Internal Server Error'] });
      break;
  }
};

module.exports = errorHandler;
