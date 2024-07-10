document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');

    function checkInputs() {
      const usernameValue = usernameInput.value.trim();
      const passwordValue = passwordInput.value.trim();

      if (usernameValue !== '' && passwordValue !== '') {
        loginBtn.removeAttribute('disabled');
      } else {
        loginBtn.setAttribute('disabled', 'disabled');
      }
    }

    usernameInput.addEventListener('input', checkInputs);
    passwordInput.addEventListener('input', checkInputs);
});