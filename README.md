# Modella Joi Validator
[![Build Status](https://drone.io/github.com/deedubs/modella-joi-validator/status.png)](https://drone.io/github.com/deedubs/modella-joi-validator/latest)

## Usage

```javascript
var Joi = require('joi');
var Modella = require('modella');
var User = Modella('User');

User
    .attr('name', {joi: Joi.string().required()});

var user = new User();

user.validate();

// user.errors 
// [{ attr: 'name', message: 'name is required' }];
```
