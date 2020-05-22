import { required, confirmed, min, email, between, integer } from 'vee-validate/dist/rules';
import { extend } from 'vee-validate';

extend('required', required);

extend('min', min);

extend('between', between);

extend('integer', integer);

extend('confirmed', confirmed);

extend('email', email);

extend('date_after', {
  params: ['target'],
  validate(value, { target }) {
    return Date.parse(target) < Date.parse(value);
  },
  message: 'The {_field_} should be set to later than {target}'
});
