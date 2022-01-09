// ----------------
// ICON SVG SECTION
// ----------------
const HOME = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width=".25"><path d="M26.84 29.94H5.38a1.36 1.36 0 0 1-1.31-1.41V14.39A1.36 1.36 0 0 1 5.38 13h21.46a1.36 1.36 0 0 1 1.31 1.4v14.13a1.36 1.36 0 0 1-1.31 1.41zM2.29 11.79l13.21-9.3a.84.84 0 0 1 1-.06c2.24 1.52 11.26 8 13.13 9.33.22.16-.06.25-.06.25H2.42s-.34-.08-.13-.22z"/></svg>'
const MENUBAR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width=".25"><rect x="1.96" y="3.95" width="28" height="6.02" rx="1.39"/><rect x="2" y="12.99" width="28" height="6.02" rx="1.39"/><rect x="2" y="22.04" width="28" height="6.02" rx="1.39"/></svg>'
const SEARCH = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20"><path d="M21.14,20.21a10.94,10.94,0,1,0-1,1L29.05,30l1-.84ZM13,22.14a9.21,9.21,0,1,1,9.21-9.21A9.21,9.21,0,0,1,13,22.14Z" stroke-miterlimit="10" stroke-width=".25"/></svg>'
const X = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20"><path d="M29,26.66a1,1,0,0,1,0,1.4L27.7,29.4a1,1,0,0,1-1.4,0L15.82,18.92,5.49,29.25a1,1,0,0,1-1.41,0L2.75,27.92a1,1,0,0,1,0-1.41L13.08,16.18,2.53,5.63a1,1,0,0,1,0-1.4L3.87,2.89a1,1,0,0,1,1.41,0L15.82,13.44,26.51,2.75a1,1,0,0,1,1.41,0l1.33,1.33a1,1,0,0,1,0,1.41L18.56,16.18Z" stroke-miterlimit="10" stroke-width=".25"/></svg>'
const CART = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-width=".25"><circle cx="12.67" cy="28.26" r="1.78"/><circle cx="24.28" cy="28.26" r="1.78"/><path d="M30 6.11H10l-.5-3.48H2l.54 2.48H6.9l3 20.82h16.87l.54-2.48H12.55l-.37-2.57h15.58zm-4.09 11.94H11.78l-1.36-9.46h16.89z" stroke-miterlimit="10"/></svg>'
const USER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-width=".25"><path d="M30.06,29.92c-1.51-9.72-4-12.36-6-12.92-2.33-.64-3.66,1.55-8,1.55s-5.73-2.2-8-1.55c-2,.56-4.51,3.21-6,12.92Z" stroke-miterlimit="10"/><circle cx="16" cy="8.99" r="6.94"/></svg>'
const CHAT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M30.07 27.22c0 .44-5.28 1.8-9.34-1.58a16.2 16.2 0 0 1-4.73.7c-7.45 0-13.49-5-13.49-11.18S8.55 4 16 4s13.49 5 13.49 11.2a10.77 10.77 0 0 1-5.81 9.19 18.11 18.11 0 0 0 4.44 2.27c1.4.44 1.95.41 1.95.56z" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width=".25"/></svg>'
const PASSWORD_SHOW = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-width=".25"><path d="M2 16c0-3.07 7.55-6.08 14-6s14 3.08 14 6.12-7.6 6-14.07 6S2 19 2 16z" stroke-miterlimit="10"/><circle cx="16" cy="16" r="2.99"/><path d="M27.95 5.99L4.05 25.97" stroke-miterlimit="10"/></svg>'
const PASSWORD_HIDDEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-width=".25"><path d="M2 15.93c0-3 7.58-6.06 14.07-6S30.05 13 30 16s-7.57 6-14 6-14-3-14-6.07z" stroke-miterlimit="10"/><circle cx="16" cy="15.96" r="2.99"/></svg>'

const iconDict = {
    'chat':CHAT,
    'home':HOME,
    'menubar':MENUBAR,
    'search':SEARCH,
    'user':USER,
    'cart':CART,
    'x':X,
    'password_show':PASSWORD_SHOW,
    'password_hidden':PASSWORD_HIDDEN,
}
// Create Icons (use className to create appropriate icons)
let icons = document.querySelectorAll('.icon')
let iconNamePattern = /__([a-z]+)$/; // e.g: classValue='icon nav__home' => iconName = 'home' (Get [1] of matchArray)
icons.forEach(icon => {
    let classValues = icon.classList.value
    let iconName = classValues.match(iconNamePattern)[1]
    icon.innerHTML = iconDict[iconName]
});
// Position
let mobileSearchIcon = document.getElementById('mobile__search__icon')
let searchInput = document.getElementById("search_input")
let leftMobileSearchIcon = searchInput.getBoundingClientRect().left + 8
mobileSearchIcon.style.left = `${leftMobileSearchIcon}px` 