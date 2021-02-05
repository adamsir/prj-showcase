const navbar = document.querySelector('#navbar')
const navbarCheeseburger = document.querySelector('.cheeseburger')
let navbarMenuVisible = false

navbarCheeseburger.addEventListener('click', () => {
  navbarMenuVisible = !navbarMenuVisible

  if (navbarMenuVisible) {
    document.body.classList.add('show-menu-popup')
    navbar.classList.add('has-mobile-menu')
    navbarCheeseburger.classList.add('role-close')
  } else {
    document.body.classList.remove('show-menu-popup')
    navbar.classList.remove('has-mobile-menu')
    navbarCheeseburger.classList.remove('role-close')
  }
})
