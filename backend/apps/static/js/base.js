// ----------------
// ICON SVG SECTION
// ----------------
const CHAT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width=".25"><path d="M25.84 10.92A6 6 0 0 1 24 15.07l-.08.08a13 13 0 0 1-9.33 3.44 15.19 15.19 0 0 1-5.3-.92A10.91 10.91 0 0 1 7.78 17l-.14-.08h0l-.1.05A22.67 22.67 0 0 1 2 18.55C3.37 18 5 17 5.45 15.32a6.17 6.17 0 0 1-2-4.4c0-4.24 5-7.68 11.21-7.68s11.18 3.44 11.18 7.68z"/><path d="M29.72 28.85a22.67 22.67 0 0 1-5.53-1.61h-.1 0a10.42 10.42 0 0 1-1.69.78 15.09 15.09 0 0 1-5.29.92c-4 0-7.42-1.4-9.4-3.52a6 6 0 0 1-1.8-4.15A6.06 6.06 0 0 1 7.78 17a10.91 10.91 0 0 0 1.55.7 15.19 15.19 0 0 0 5.3.92A13 13 0 0 0 24 15.15c2.64 1.41 4.34 3.6 4.34 6.07a6.17 6.17 0 0 1-2 4.4c.4 1.64 2.01 2.63 3.38 3.23z"/></svg>'
const HOME = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width=".25"><path d="M26.84 29.94H5.38a1.36 1.36 0 0 1-1.31-1.41V14.39A1.36 1.36 0 0 1 5.38 13h21.46a1.36 1.36 0 0 1 1.31 1.4v14.13a1.36 1.36 0 0 1-1.31 1.41zM2.29 11.79l13.21-9.3a.84.84 0 0 1 1-.06c2.24 1.52 11.26 8 13.13 9.33.22.16-.06.25-.06.25H2.42s-.34-.08-.13-.22z"/></svg>'
const MENUBAR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-miterlimit="10" stroke-width=".25"><rect x="1.96" y="3.95" width="28" height="6.02" rx="1.39"/><rect x="2" y="12.99" width="28" height="6.02" rx="1.39"/><rect x="2" y="22.04" width="28" height="6.02" rx="1.39"/></svg>'
const SEARCH = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20"><path d="M21.14,20.21a10.94,10.94,0,1,0-1,1L29.05,30l1-.84ZM13,22.14a9.21,9.21,0,1,1,9.21-9.21A9.21,9.21,0,0,1,13,22.14Z" stroke-miterlimit="10" stroke-width=".25"/></svg>'
const USER = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-width=".25"><path d="M30.06,29.92c-1.51-10.38-4-13.19-6-13.79-2.33-.69-3.66,1.65-8,1.65s-5.73-2.34-8-1.65c-2,.6-4.51,3.42-6,13.79Z" stroke-miterlimit="10"/><circle cx="16" cy="9.36" r="7.31"/></svg>'
const CART = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20" stroke-width=".25"><circle cx="7.67" cy="28.26" r="1.78"/><circle cx="22.28" cy="28.26" r="1.78"/><path d="M30,6H4.6L4.12,2H2l2.89,24h19.9l.58-1.87H6.77L6.28,20H26.55ZM6,17.89l-1.2-10L27.92,8,25.17,18.11Z" stroke-miterlimit="10"/></svg>'
const X = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="#231f20"><path d="M29,26.66a1,1,0,0,1,0,1.4L27.7,29.4a1,1,0,0,1-1.4,0L15.82,18.92,5.49,29.25a1,1,0,0,1-1.41,0L2.75,27.92a1,1,0,0,1,0-1.41L13.08,16.18,2.53,5.63a1,1,0,0,1,0-1.4L3.87,2.89a1,1,0,0,1,1.41,0L15.82,13.44,26.51,2.75a1,1,0,0,1,1.41,0l1.33,1.33a1,1,0,0,1,0,1.41L18.56,16.18Z" stroke-miterlimit="10" stroke-width=".25"/></svg>'

const iconDict = {
    'chat':CHAT,
    'home':HOME,
    'menubar':MENUBAR,
    'search':SEARCH,
    'user':USER,
    'cart':CART,
    'x':X
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