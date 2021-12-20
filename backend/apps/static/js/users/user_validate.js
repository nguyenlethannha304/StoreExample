// {invalidField, validField} = _base.js

const EMAIL_PATTERN = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const PHONE_PATTERN = /^(\+84|0)(\d{9})$/g

var validateUsername = (username) => {
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
let checkEmailExists = (email_field) => {
    // Check if email is already registed
    let params = '?email=' + email_field.value
    let request = new Request(`/users/api/check_email_exists/${params}`)
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
let togglePassword = (passwordInput) => {
    if (passwordInput.type == 'password') {
        passwordInput.type = 'text'
    } else {
        passwordInput.type = 'password'
    }
}