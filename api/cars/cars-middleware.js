const Cars = require('./cars-model');
const vinValidator = require('vin-validator');

const checkCarId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const car = await Cars.getById(id);
    if (!car) {
      res.status(404).json({ message: `car with id ${id} is not found`});
    } else {
      req.car = car;
      next();
    }
  } catch(err) {
    next(err);
  };
};

const checkCarPayload = (req, res, next) => {
  const { vin, make, model, mileage } = req.body;
  if (vin === undefined) {
    res.status(400).json({ message: "vin is missing" });
  } else if (make === undefined) {
    res.status(400).json({ message: "make is missing" });
  } else if (model === undefined) {
    res.status(400).json({ message: "model is missing" });
  } else if (mileage === undefined) {
    res.status(400).json({ message: "mileage is missing" });
  } else {
    req.vin = vin;
    req.make = make;
    req.model = model;
    req.mileage = mileage;
    next();
  };
};

const checkVinNumberValid = (req, res, next) => {
  const { vin } = req.body;
  if (!vinValidator.validate(vin)) {
    res.status(400).json({ message: `vin ${vin} is invalid` });
  } else {
    req.vin = vin;
    next();
  };
};

const checkVinNumberUnique = async (req, res, next) => {
  const { vin } = req.body;
  try {
    const carVin = await Cars.getByVin(vin);
    if (carVin) {
      res.status(400).json({ message: `vin ${vin} already exists` });
    } else {
      req.vin = vin;
      next();
    }
  } catch(err) {
    next(err);
  };
};

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique
}