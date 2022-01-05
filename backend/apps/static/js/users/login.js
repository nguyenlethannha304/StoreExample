// IMPORT
// {getCssValue} = _base.js
// {validateUsername} = user_validate.js

let username = document.querySelector('#id_username')
username.addEventListener('blur', () => {
    validateUsername(username)
})
let passwordInput = document.getElementById('id_password')
let showPassword = document.querySelector('.show-password')
// Caculate css-left-attribute for showPassword
// left = calc(body.margin + form.padding + input.width - showPassword.width)
if (showPassword) {
    let bodyMargin = getCssValue(document.querySelector('body'), 'margin')
    let formPadding = getCssValue(document.querySelector('form'), 'padding')
    let passwordInputWidth = getCssValue(document.querySelector('#id_password'), 'width')
    let showPasswordWidth = getCssValue(showPassword, 'width')
    showPassword.style.left = `${bodyMargin + formPadding + passwordInputWidth - showPasswordWidth}px`
    // addEventListening for showPassword
    showPassword.addEventListener('click', () => {
        togglePassword(passwordInput)
    })
}
