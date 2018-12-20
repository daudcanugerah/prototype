const Joi = require('joi');

module.exports.validateRequest = (schema) => {
    return (req, res, next) => {
        const validations = ['headers', 'params', 'query', 'body']
            .map(key => {
                const schema = requestSchema[key];
                const value = req[key];
                const validate = () => schema ? schema.validate(value) : Promise.resolve({});
                return validate().then(result => ({ [key]: result }));
            });
        return Promise.all(validations)
            .then(result => {
                let validated = Object.assign({}, ...result);
                res.json(validated);
                next();
            }).catch(validationError => {
                console.log(validationError);
                const message = validationError.details.map(d => d.message);
                res.status(400).send(validationError);
            });
    };
}

module.exports.addPost = {
    body: Joi.object({
        category: Joi.any().required(),
        tweet: Joi.any().required(),
    })
}
