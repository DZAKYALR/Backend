const { FlipCard } = require("../models/index");

class ControllerFlipCard {
  static findBySetCardId(req, res, next) {
    FlipCard.findAll({
      where: {
        set_card_id: +req.params.set_card_id,
      },
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err)
      })
  }

  static insert(req, res, next) {
    let set_card_id = null
    if (req.body.set_card_id || req.body.set_card_id === '') {
      set_card_id = req.body.set_card_id
    } else {
      set_card_id = req.params.set_card_id
    }
    let obj = {
      hint: req.body.hint,
      answer: req.body.answer,
      type: req.body.type,
      set_card_id: set_card_id,
    };
    FlipCard.create(obj)
      .then((data) => res.status(201).json(data))
      .catch((err) => {
        next(err);
      });
  }

  static update(req, res, next) {
    let id = +req.params.id; /// check this out
    let obj = {
      hint: req.body.hint,
      answer: req.body.answer,
      type: req.body.type
    };
    FlipCard.update(obj, {
      where: {
        id,
      },
      returning: true,
    })
      .then((data) => {
        if (data[0]) {
          res.status(200).json(data[1]);
        }
        
      })
      .catch((err) => {
        next(err);
      });
  }
  
  static delete(req, res, next) {
    let id = +req.params.id;
    let deleted = {
      name: "Card Deleted",
    };
    FlipCard.destroy({
      where: {
        id,
      },
    })
      .then((data) => {
        if (data === 1) {
          res.status(200).json(deleted);
        }
       
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = ControllerFlipCard;
