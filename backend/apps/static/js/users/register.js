// {getCssValue, invalidField} = _base.js
// {validateEmail, checkEmailExist} = users/user_validate.js


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
// Add password toggle
let passwordShow1 = document.querySelector('.password1')
let passwordInput1 = document.getElementById('id_password1')
passwordShow1.addEventListener('click', () => {
    if (passwordInput1.type == 'password') { passwordInput1.type = 'text' }
    else { passwordInput1.type = 'password' }
})
let passwordShow2 = document.querySelector('.password2')
let passwordInput2 = document.getElementById('id_password2')
passwordShow2.addEventListener('click', () => {
    if (passwordInput2.type == 'password') { passwordInput2.type = 'text' }
    else { passwordInput2.type = 'password' }
})
// Password fields
let attrLength = passwordInput1.getBoundingClientRect().right
// Caculate css-left-attribute for passwordShow
let passwordShows = document.querySelectorAll('.password-show')
if (passwordShows != []) {
    passwordShows.forEach((passwordShow) => {
        // left = calc(body.margin + form.padding + input.width - passwordShow.width)
        addPositionDirectionAttribute(passwordShow, 'left', attrLength)
    })
}
