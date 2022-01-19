// {invalidField, validField} = _base.js

const EMAIL_PATTERN = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const PHONE_PATTERN = /^(\+84|0)(\d{9})$/g
const CHECK_EMAIL_EXIST_API = '/api/users/check_email_exists'
let validateUsername = (username) => {
    // Check username follow email or phone pattern
    if (username.value) {
        if (validateEmail(username.value)) { ; }
        else if (validatePhone(username.value)) {
            username.value = uniformPhoneNumber(username.value)
        } else {
            message = 'Your email or phone is incorrect'
            return invalidField(username, message)
        }
        return validField(username)
    }
}

let validateEmail = (email_value) => {
    return email_value.match(EMAIL_PATTERN)
}

let validatePhone = (phone_value) => {
    return phone_value.match(PHONE_PATTERN)
}

let uniformPhoneNumber = (phone_value) => {
    // Change phone number to format (+84 + phone_number)
    if (validatePhone(phone_value) && phone_value.startsWith('0')) {
        phone_value = '+84' + phone_value.slice(1)
    }
    return phone_value
}
// Password Field
let addPositionDirectionAttribute = (element, attribute, attrLength) => {
    if (attribute == 'left' || attribute == 'right') {
        attrLength = attrLength - getCssValue(element, 'width')
    } else if (attribute == 'top' || attribute == 'bottom') {
        attrLength = attrLength - getCssValue(element, 'height')
    }
    element.style[attribute] = `${attrLength}px`
}
let togglePassword = (passwordInput) => {
    if (passwordInput.type == 'password') {
        passwordInput.type = 'text'
    } else {
        passwordInput.type = 'password'
    }
}
// Toggle password-fields (Show <==> Hidden)
let passwordContainers = document.querySelectorAll('.password-container')
if(passwordContainers){
    passwordContainers.forEach(container => {
        let icon = container.querySelector('.password-icon')
        let input = container.querySelector('input')
        icon.addEventListener('click', () => {
            container.classList.toggle('password-show')
            container.classList.toggle('password-hidden')
            if(container.classList.contains('password-show')){
                input.type = 'text'
            } else {
                input.type = 'password'
            }
        })
    }
)
}
