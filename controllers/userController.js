const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
let userController = {};

userController.getAll = async(req, res) => {
    try{
        if(res.locals.user){
            let users = await userModel.find();
            res.status(200).json({
                msg : "get users",
                count : users.length,
                usersData : users
            })
        }
        else{
            return res.status(402).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
userController.get = async (req, res) => {
    let id = req.params.userId;
    try{
        if(res.locals.user){
            let user = await userModel.findById(id);
            if(!user){
                return res.status(403).json({
                    msg : "not userId"
                })
            }
            else{
                res.status(200).json({
                    msg : "get user",
                    userData : user
                })
            }
        }
        else{
            return res.status(402).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
userController.signup = async (req, res) => {
    const {name, email, password} = req.body;
    try{
        let user = await userModel.findOne({email});
        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            let user = new userModel({
                name, email, password
            })
            await user.save()
            res.status(200).json({
                msg : "success signup"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
userController.login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            await user.comparePassword(password, (err, isMatch) => {
                if(err || !isMatch){
                    return res.status(401).json({
                        msg : "not match password"
                    })
                }
                else{
                    const payload = {
                        id : user._id,
                        email : user.email
                    }

                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {
                            expiresIn : "1h"
                        }
                    )

                    res.status(200).json({
                        msg : "success login",
                        userData : user,
                        token : token
                    })
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
userController.update = async (req, res) => {
    let id = req.params.userId;
    try{
        if(res.locals.user){
            let user = await userModel.findByIdAndUpdate(id, {$set : {
                            name : req.body.name,
                            email : req.body.email
                        }});

            if(!user){
                return res.status(403).json({
                    msg : "not userId"
                })
            }
            else{
                res.status(200).json({
                    msg : "update user by id: " + id
                })
            }
        }
        else{
            return res.status(402).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
userController.deleteAll = async (req, res) => {
    try{
        if(res.locals.user){
            await userModel.remove()
            res.status(200).json({
                msg : "delete users"
            })
        }
        else{
            return res.status(402).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
userController.delete = async (req, res) => {
    let id = req.params.userId;
    try{
        if(res.locals.user){
            let user = await userModel.findByIdAndRemove(id);
            if(!user){
                return res.status(403).json({
                    msg : "not userId"
                })
            }
            else{
                res.status(200).json({
                    msg : "delete user by id: " + id
                })
            }
        }
        else{
            return res.status(402).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

module.exports = userController