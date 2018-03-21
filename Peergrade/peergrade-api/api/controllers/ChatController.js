/**
 * ChatController
 *
 * @description :: Server-side actions for handling incoming requests to send/receive messages.
 *
 */

const Joi = require('joi');

module.exports = {

  //fetch messages
  fetch : (req, res) => {
    const schema = Joi.object().keys({
      id: Joi.number().required().options({language: {any: {empty: 'is required'}}}).label('User'),
    });

  Joi.validate(req.params, schema, {abortEarly: false}, async (err, value) => {

    if (err) {
      return res.badRequest(err.details, "Validation errors occurred");
    }

    let user = req.params['id'];

    try {
      let messages = await Chat.find({
        or : [
          { fromUser: user },
          { toUser: user }
        ]
      })
        .populate('toUser')
        .populate('fromUser');

      if(messages && messages.length){
        return res.ok(messages);
      }
      else{
       return res.notFound(null, "No chat found");
      }
    } catch (err) {
      return res.serverError(err);
    }
  });

  },

  //saves sent message
  send : (req, res) => {
    const schema = Joi.object().keys({
      fromUser: Joi.number().required().options({language: {any: {empty: 'is required'}}}).label('From User'),
      toUser: Joi.number().required().options({language: {any: {empty: 'is required'}}}).label('To User'),
      message: Joi.string().required().options({language: {any: {empty: 'is required'}}}).label('Message'),
    });

    Joi.validate(req.body, schema, {abortEarly: false}, async (err, value) => {
      if (err) {
        return res.badRequest(err.details, "Validation errors occurred");
      }

      let data = req.body;

      try {

        let chat = await Chat.create(data).fetch();

        let messages = await Chat.find({
          or : [
            { fromUser: data.fromUser },
            { toUser: data.fromUser }
          ]
        })
          .populate('toUser')
          .populate('fromUser')
          .sort('createdAt ASC');

        if(messages && messages.length){
          return res.ok(messages);
        }

        return res.ok();

      } catch(err) {
        return res.serverError(err);
      }

    });
  }

};

