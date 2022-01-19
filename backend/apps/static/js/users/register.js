// {getCssValue, invalidField} = _base.js
// {validateEmail} = users/user_validate.js


// Email field
let email = document.querySelector('#id_email')
email.addEventListener('blur', () => {
    if (email.value != '') {
        if (validateEmail(email.value)) {
            validField(email)
            // Check if email is already registed
            checkEmailExists(email)
        } else {
            let message = "Your email format is not allowed"
            invalidField(email, message)
        }
    }
})
// Password fields
let passwordInput1=  document.getElementById('id_password1')
let attrLength = passwordInput1.getBoundingClientRect().right
// Caculate css-left-attribute for passwordIcon
let passwordIcons = document.querySelectorAll('.password-icon')
if (passwordIcons != []) {
    passwordIcons.forEach((passwordIcon) => {
        // left = calc(body.margin + form.padding + input.width - passwordIcon.width)
        addPositionDirectionAttribute(passwordIcon, 'left', attrLength)
    })
}
// Sub-functions
let checkEmailExists = (email_field) => {
    // Check if email is already registed
    let params = '?email=' + email_field.value
    let request = new Request(`${CHECK_EMAIL_EXIST_API}/${params}`)
    fetch(request).then(res => {
        if (res.ok) { return res.json() }
    }).then(json_data => {
        return json_data.exists
    }).then(email_exist_boolean => {
        if (!email_exist_boolean) {
            let message = "You can use this email"
            validField(email_field, message)
        } else {
            let message = "The email is already registed"
            invalidField(email_field, message)
        }
    })
}