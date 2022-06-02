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
    let hideFieldClass = ['field-thumbnail', 'field-slug']
    let fieldDivs = productForm.querySelectorAll('div')
    hideFieldClass.forEach(className => {
        fieldDivs.forEach(div => {
            if(div.classList.contains(className)){
                div.style.display = 'none'
            }
        })
    })
}
