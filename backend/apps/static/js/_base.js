let getChildrenByClass = (node, class_name) => {
    class_name = '.' + class_name
    return node.querySelectorAll(class_name)
}
// ELEMENT FUNCTION
var createNode = (tagName, className, content = None) => {
    node = document.createElement(tagName)
    node.classList.add(className)
    if (content) { node.innerText = content }
    return node
}
// BASIC FORM FUNCTION
var validField = (field, message = null) => {
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
var invalidField = (field, message) => {
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
    if (getChildrenByClass(parent, class_name).length) { return }
    else {
        let child_with_message = createNode('p', class_name, message)
        parent.appendChild(child_with_message)
    }
}
let removeMessage = (field, class_name) => {
    let parent = field.parentNode
    let children = getChildrenByClass(parent, class_name)
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
var getCssValue = (element, property, getNumber = true) => {
    let dataString = getComputedStyle(element).getPropertyValue(property)
    let dataArray = dataString.match(CSS_PROPERTY_VALUE_PATTERN)
    if (getNumber) {
        return convertToPixel(dataArray[1], dataArray[2])
    } else {
        return dataArray[0]
    }
}
var convertToPixel = (number, unit) => {
    number = parseInt(number)
    if (unit == 'px') {
        return number
    } else if (unit == 'rem') {
        return number * 1.6
    } else {
        console.log(`Wrong types of data ${number}: must be number and ${unit}:must be measurement unit`)
    }
}