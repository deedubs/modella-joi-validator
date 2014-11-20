var Modella = require('modella');
var Joi = require('joi');
var JoiValidatorFactory = require('../');
var expect = require('chai').expect

describe('Modella Joi Validator', function() {

    var model;

    beforeEach(function() {

        var JoiValidator = JoiValidatorFactory();

        model = Modella('test-model');

        model
            .attr('name', {
                joi: Joi.string().required()
            })
            .attr('bio')
            .attr('age', {
                joi: Joi.number().greater(15).required()
            });

        model.use(JoiValidator);            
    })

    it('should be useable', function() {

        expect(model.validators).to.have.lengthOf(1);
    });

    it('should allow passing config to Joi', function() {

        var customJoiValidator = JoiValidatorFactory({
            abortEarly: true
        });

        var otherModel = Modella('other-model');

        otherModel
            .attr('name', {
                joi: Joi.string().required()
            })
            .attr('age', {
                joi: Joi.number().greater(15).required()
            });

        otherModel.use(customJoiValidator);

        var user = new otherModel();

        user.validate();

        expect(user.errors).to.have.lengthOf(1);
    });

    it('should populate instance.errors properly', function() {

        var user = new model();

        user.validate();

        expect(user.errors).to.have.lengthOf(2);

        var fieldsWithErrors = user.errors.map(function (error) {

            return error.attr;
        });

        expect(fieldsWithErrors).to.have.members(['name','age']);
        expect(fieldsWithErrors).to.not.have.members(['bio']);   
    });

    it('should not populate errors if model is valid', function () {

        var user = new model({
            name: 'Test',
            age: 28
        });

        user.validate();

        expect(user.errors).to.have.lengthOf(0);
    });
});