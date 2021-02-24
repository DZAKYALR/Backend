const { SetCard, User } = require("../models/index");
const { Op } = require("sequelize");

class ControllerSetCard {
    static findAll(req, res, next) {
        SetCard.findAll({ include: [{
            model: User,
            attributes: ["id", 'email', 'first_name', 'last_name' ]
            }] 
         })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(500).json(err)
            });
    }
    
    static findSetCardByTitle(req, res, next) {
        SetCard.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${req.params.query}%`,
                },
            }
            ,include: [{
                model: User,
                attributes: ["id", 'email', 'first_name', 'last_name' ]
                }] 
             })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    static insert(req, res, next) {
        let user_id = null
        if (req.body.user_id || req.body.user_id === null || req.body.user_id === '') {
            user_id = req.body.user_id
        } else {
            user_id = +req.user.id
        }
        let obj = {
            category: req.body.category,
            title: req.body.title,
            user_id: user_id,
        };
        SetCard.create(obj)
            .then((data) => res.status(201).json(data))
            .catch((err) => {
                next(err);
            });
    }

    static update(req, res, next) {
        let id = +req.params.id;
        let user_id = null
        if (req.body.user_id || req.body.user_id === null || req.body.user_id === '') {
            user_id = req.body.user_id
        } else {
            user_id = +req.user.id
        }
        let obj = {
            category: req.body.category,
            title: req.body.title,
            user_id: user_id
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
