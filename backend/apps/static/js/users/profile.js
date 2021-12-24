let phoneInput = document.getElementById('id_phone')
phoneInput.addEventListener('blur', () => {
    if (validatePhone(phoneInput.value)) {
        if (phoneInput.value.startsWith('0')) {
            phoneInput.value = uniformPhoneNumber(phoneInput.value)
        }
        validField(phoneInput)
    } else {
        let message = "Your phone format is incorrect (must be 10 digits)"
        invalidField(phoneInput, message)
    }
})