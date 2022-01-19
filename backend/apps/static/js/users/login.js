// IMPORT
// {getCssValue} = _base.js
// {validateUsername} = user_validate.js

let username = document.querySelector('#id_username')
username.addEventListener('blur', () => {
    validateUsername(username)
})
let passwordInput = document.getElementById('id_password')
let passwordIcon = document.querySelector('.password-icon')
if (passwordIcon) {
    // Caculate css-left-attribute for passwordShow
    // left = calc(passwordInput.getBoundingClientRect().right - passwordShow.width)
    let attrLength = passwordInput.getBoundingClientRect().right
    addPositionDirectionAttribute(passwordIcon, 'left', attrLength)
}
