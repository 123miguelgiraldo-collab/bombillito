const userIcon = document.querySelector('.user-icon');
const menu = document.querySelector('.dropdown-menu')

userIcon.addEventListener('click', () => {
  menu.classList.toggle('open-menu');
})