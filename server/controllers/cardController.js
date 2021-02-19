const { FlipCard } = require('../models/index')
const { Op } = require("sequelize");
class ControllerFlipCard{
    
    static findAllFlipCard(req, res, next) {
        FlipCard.findAll()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            next(err)
        })
    }

    static findFlipCardById(req, res, next) {
        FlipCard.findAll({
            where: {
                user_id: +req.params.id
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            next(err)
        })
    }

    static findFlipCardByCategory(req, res, next) {
        FlipCard.findAll({
            where: {
                category: {
                    [Op.iLike]: `%${req.params.query}%`
                }
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            next(err)
        })
    }

    static findFlipCardByTitle(req, res, next) {
        console.log(req.params.query);
        FlipCard.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${req.params.query}%`
                }
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            console.log(err);
            next(err)
        })
    }

    static insert(req, res, next) {
        console.log(req.body);
        let obj = {
            hint:req.body.hint,
            answer: req.body.answer,
            category: req.body.category,
            type: req.body.type,
            title: req.body.title,
            user_id: req.user.id
        }
        FlipCard.create(obj)
        .then(data => res.status(201).json(data))
        .catch(err => {
            next(err)
            console.log(err);
        })
    }

    static update(req, res, next) {
        let id = +req.params.id
        let obj = {
            hint:req.body.hint,
            answer: req.body.answer,
            category: req.body.category,
            type: req.body.type,
            title: req.body.title,
            user_id: req.user.id
        }
        FlipCard.update(obj,{
            where: {
                id
            },
            returning: true
        })
        .then((data) => {
            // returning true (1) either false
            if(data[0]) {
                res.status(200).json(data[1])
            } else {
                next({
                    name: "ResourceNotFound" 
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }
    static patch(req, res, next) {
        let id = +req.params.id
        let obj = { categoryId:req.body.categoryId }
        FlipCard.update(obj, {
            where: {
                id
            },
            returning: true
        })
        .then((data) => {
            // returning true (1) either false
            if(data[0]){
                res.status(200).json(data[1])
            } else {
                next({
                    name: "ResourceNotFound" 
                })
            }
        })
        .catch(err => {
            next(err)
        })
    }
    static delete(req, res, next) {
        let id = +req.params.id
        let deleted = {
            name: 'Card Deleted'
        }
        FlipCard.destroy({
            where: {
                id
            }
        })
        .then((data) => {
            if(data === 1) {
                res.status(200).json(deleted)
            } else {
                next({
                    name: "ResourceNotFound" 
                })
            }
        })
        .catch(() =>  {
            next(err)
        })
    }
}

module.exports = ControllerFlipCard