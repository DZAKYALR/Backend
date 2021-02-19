const { SetCard } = require("../models/index");
const { Op } = require("sequelize");

class ControllerSetCard {
    static findAll(req, res, next) {
        SetCard.findAll()
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                next(err);
            });
    }
    
    static findSetCardByTitle(req, res, next) {
        SetCard.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${req.params.query}%`,
                },
            },
        })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    static insert(req, res, next) {
        let obj = {
            category: req.body.category,
            title: req.body.title,
            user_id: req.user.id,
        };
        SetCard.create(obj)
            .then((data) => res.status(201).json(data))
            .catch((err) => {
                next(err);
            });
    }

    static update(req, res, next) {
        let id = +req.params.id;
        let obj = {
            category: req.body.category,
            title: req.body.title,
            user_id: req.user.id,
        };
        SetCard.update(obj, {
            where: {
                id,
            },
            returning: true,
        })
            .then((data) => {
                // returning true (1) either false
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
            name: "set Card Deleted",
        };
        SetCard.destroy({
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

module.exports = ControllerSetCard;
