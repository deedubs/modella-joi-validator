var Joi = require('joi');

var internals = {
    defaults: {
        abortEarly: false
    }
};

module.exports = function(options) {

    if (!options) {

        options = internals.defaults;
    }

    return function JoiModella(Model) {

        var schema = {};

        Object
            .keys(Model.attrs)
            .forEach(function populateSchema(attribute) {

                var validator = Model.attrs[attribute].joi;

                if (!validator) {

                    return;
                }

                schema[attribute] = validator;
            });

        Model.joiSchema = Joi.object().keys(schema);

        Model.validate(function validateWithJoi(model) {

            Joi.validate(
                model.attrs,
                Model.joiSchema,
                options,
                function handleValidation(err) {

                    if (err) {

                        err
                            .details
                            .forEach(function handleFieldError(field) {

                                model.error(field.path, field.message);
                            });
                    }
                });
        });
    };
};