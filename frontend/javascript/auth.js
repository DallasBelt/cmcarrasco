document.addEventListener('DOMContentLoaded', () => {
  let user = sessionStorage.getItem('usuario')
  let usernameDisplay = document.getElementById('username-display')
  let logoutButton = document.getElementById('logout')

  if (user) {
    usernameDisplay.innerHTML = user
  } else {
    window.location.href = '../login.html'
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem('usuario');
      window.location.href = '../login.html'
    })
  }
})
