
let oldPassword = document.getElementById('id_old_password')
let newPassword = document.getElementById('id_new_password1')
let confirmPassword = document.getElementById('id_new_password2')
let attrLength = oldPassword.getBoundingClientRect().right
// Caculate css-left-attribute for passwordShow
let passwordShows = document.querySelectorAll('.password-icon')
passwordShows.forEach(passwordShow => {
    // left = calc(inputPassword.getBoundingClientRect().right - passwordShow.width)
    addPositionDirectionAttribute(passwordShow, 'left', attrLength)
})
