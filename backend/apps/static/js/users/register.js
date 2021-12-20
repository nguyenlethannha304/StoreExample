// {validField, invalidField} = _base.js
// {validateEmail, checkEmailExist} = users/user_validate.js

let email = document.querySelector('#id_email')
email.addEventListener('blur', () => {
    if (validateEmail(email.value)) {
        // Check if email is already registed
        validField(email)
        checkEmailExists(email)
    } else {
        let message = "Your email format is not allowed"
        invalidField(email, message)
    }
})
// 