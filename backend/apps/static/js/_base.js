// ELEMENT FUNCTION
let createNode = (tagName, className, content = None) => {
    node = document.createElement(tagName)
    node.classList.add(className)
    if (content) { node.innerText = content }
    return node
}
// BASIC FORM FUNCTION
let validField = (field, message = null) => {
    if (field.classList.contains('invalid')) {
        field.classList.remove('invalid');
        removeErrorMessage(field)
    }
    field.classList.add('valid')
    if (message) {
        showSuccessMessage(field, message)
    }
    return true
}
let invalidField = (field, message) => {
    if (field.classList.contains('valid')) {
        field.classList.remove('valid');
        removeSuccessMessage(field)
    }
    field.classList.add('invalid')
    showErrorMessage(field, message)
    return false
}
let createMessage = (field, message, class_name) => {
    let parent = field.parentNode
    let childrenMess = parent.querySelectorAll(`.${class_name}`)
    let created = false
    // Check if chilMessage existed
    if (childrenMess != []) {
        for (child of childrenMess) {
            if (child.innerText == message) {
                created = true
                break
            }
        }
    }
    // If not create childMess
    if (created == false) {
        let childWithMess = createNode('p', class_name, message)
        parent.appendChild(childWithMess)
    }
}
let removeMessage = (field, class_name) => {
    let parent = field.parentNode
    let children = parent.querySelectorAll(`.${class_name}`)
    for (child of children) {
        parent.removeChild(child)
    }
}
let showSuccessMessage = (field, message) => {
    createMessage(field, message, 'success')
}
let removeSuccessMessage = (field) => {
    removeMessage(field, 'success')
}
let showErrorMessage = (field, message) => {
    createMessage(field, message, 'error')
}
let removeErrorMessage = (field) => {
    removeMessage(field, 'error')
}
// CSS FUNCTION
const CSS_PROPERTY_VALUE_PATTERN = /([0-9.]*)(.*)/ //Get digits and everything followed
let getCssValue = (element, property, getNumber = true) => {
    let dataString = getComputedStyle(element).getPropertyValue(property)
    let dataArray = dataString.match(CSS_PROPERTY_VALUE_PATTERN)
    if (getNumber) {
        return convertToPixel(dataArray[1], dataArray[2])
    } else {
        return dataArray[0]
    }
}
let convertToPixel = (number, unit) => {
    number = parseInt(number)
    if (unit == 'px') {
        return number
    } else if (unit == 'rem') {
        return number * 1.6
    } else {
        console.log(`Wrong types of data ${number}: must be number and ${unit}:must be measurement unit`)
    }
}