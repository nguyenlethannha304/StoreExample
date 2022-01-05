
let oldPassword = document.getElementById('id_old_password')
let newPassword = document.getElementById('id_new_password1')
let confirmPassword = document.getElementById('id_new_password2')
let attrLength = oldPassword.getBoundingClientRect().right
// Caculate css-left-attribute for passwordShow
let passwordShows = document.querySelectorAll('.password-show')
passwordShows.forEach(passwordShow => {
    // left = calc(inputPassword.getBoundingClientRect().right - passwordShow.width)
    addPositionDirectionAttribute(passwordShow, 'left', attrLength)
})
let oldPasswordShow = document.querySelector('.old-password-input')
oldPasswordShow.addEventListener('click', () => {
    togglePassword(oldPassword)
})
let newPasswordShow = document.querySelector('.new-password1-input')
newPasswordShow.addEventListener('click', () => {
    togglePassword(newPassword)
})
let confirmPasswordShow = document.querySelector('.new-password2-input')
confirmPasswordShow.addEventListener('click', () => {
    togglePassword(confirmPassword)
})