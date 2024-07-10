document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];
    const modalMessage = document.getElementById("modalMessage");

    function checkInputs() {
      if (emailInput.value.trim() !== '' && subjectInput.value.trim() !== '' && messageInput.value.trim() !== '') {
        submitBtn.classList.remove('disabled');
        submitBtn.removeAttribute('disabled');
      } else {
        submitBtn.classList.add('disabled');
        submitBtn.setAttribute('disabled', 'disabled');
      }
    }

    emailInput.addEventListener('input', checkInputs);
    subjectInput.addEventListener('input', checkInputs);
    messageInput.addEventListener('input', checkInputs);

    document.getElementById('feedbackForm').addEventListener('submit', function(event) {
      event.preventDefault();

      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      fetch('/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, subject, message })
      })
      .then(response => response.json())
      .then(data => {
        modalMessage.innerText = data.message;
        modal.style.display = "block";
        emailInput.value = '';
        subjectInput.value = '';
        messageInput.value = '';
        submitBtn.classList.add('disabled');
        submitBtn.setAttribute('disabled', 'disabled');
      })
      .catch(error => console.error('Error:', error));
    });

    span.onclick = function() {
      modal.style.display = "none";
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  });