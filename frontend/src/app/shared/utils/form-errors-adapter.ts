import { HttpErrorResponse } from '@angular/common/http';
import { FormErrors } from '../interface/errors';

export let formErrorAdapter = (
  httpErrorResponse: HttpErrorResponse
): FormErrors => {
  let result: FormErrors = {};
  let errors = httpErrorResponse.error;
  for (let key in errors) {
    let value = errors[key];
    let stringValue = Array.from(value).join(', ');
    result = Object.assign(result, { [key]: stringValue });
  }
  return result;
};
