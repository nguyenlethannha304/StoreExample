HIDE_FIELD_LIST = ['field-thumbnail', ]
document.onreadystatechange = () => {
    switch(document.readyState){
        case "interactive":
            setUp()
            break
        default:
            break
    }
}
let setUp = () => {
    let productForm = document.getElementById('product_form')
    let hideFieldClass = HIDE_FIELD_LIST
    let fieldDivs = productForm.querySelectorAll('div')
    hideFieldClass.forEach(className => {
        fieldDivs.forEach(div => {
            if(div.classList.contains(className)){
                div.style.display = 'none'
            }
        })
    })
}
