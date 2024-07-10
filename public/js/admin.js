document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-btn');
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');

    const addContent = document.getElementById('add-content');
    const editContent = document.getElementById('edit-content');
    const deleteContent = document.getElementById('delete-content');

    const editFormContainer = document.getElementById('edit-form-container');
    const editForm = document.getElementById('edit-form');

    const deleteSelectedBtn = document.getElementById('delete-selected-btn');

    addContent.style.display = 'none';
    editContent.style.display = 'none';
    deleteContent.style.display = 'none';

    addBtn.addEventListener('click', () => {
        addContent.style.display = 'block';
        editContent.style.display = 'none';
        deleteContent.style.display = 'none';
        loadGenres();
    });

    editBtn.addEventListener('click', () => {
        addContent.style.display = 'none';
        editContent.style.display = 'block';
        deleteContent.style.display = 'none';
        loadEditGenres();
    });

    deleteBtn.addEventListener('click', () => {
        addContent.style.display = 'none';
        editContent.style.display = 'none';
        deleteContent.style.display = 'block';
    });

    function loadGenres() {
        fetch('/get-genres')
            .then(response => response.json())
            .then(genres => {
                const genreSelect = document.getElementById('genreInput');
                genreSelect.innerHTML = '<option value="">Выберите жанр</option>';
                genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.genre_name;
                    option.textContent = genre.genre_name;
                    genreSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Ошибка загрузки жанров:', error));
    }

    function loadEditGenres() {
        fetch('/get-genres')
            .then(response => response.json())
            .then(genres => {
                const genreSelect = document.getElementById('editgenreInput');
                genreSelect.innerHTML = '<option value="">Выберите жанр</option>';
                genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.genre_name;
                    option.textContent = genre.genre_name;
                    genreSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Ошибка загрузки жанров:', error));
    }

    deleteSelectedBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.product-checkbox:checked');
        const selectedProducts = Array.from(checkboxes).map(cb => cb.value);

        if (selectedProducts.length > 0) {
            if (confirm('Вы уверены, что хотите удалить выбранные товары?')) {
                fetch('/delete-products', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ products: selectedProducts })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        alert('Ошибка удаления товаров. Пожалуйста, попробуйте еще раз.');
                    }
                })
                .catch(error => {
                    console.error('Ошибка удаления товаров:', error);
                    alert('Ошибка удаления товаров. Пожалуйста, попробуйте еще раз.');
                });
            }
        } else {
            alert('Выберите товары для удаления');
        }
    });

    document.getElementById('add-form').addEventListener('submit', function(event) {
        event.preventDefault();
  
        const name = nameInput.value.trim();
        const price = priceInput.value.trim();
        const image_filename = imageInput.value.split("\\").pop();
        const genre = genreInput.value.trim();
  
        fetch('/add-product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, genre, price, image_filename})
        })
        .then(response => response.json())
        .then(data => {
          nameInput.value = '';
          priceInput.value = '';
          imageInput.value = '';
          genreInput.value = '';
        })
        .catch(error => console.error('Error:', error));
      });

      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-id');
            fetch(`/get-product/${productId}`)
                .then(response => response.json())
                .then(product => {
                    document.getElementById('editProductId').value = product.id;
                    document.getElementById('nameInput').value = product.name;
                    document.getElementById('priceInput').value = product.price;
                    document.getElementById('genreInput').value = product.genre;
                    editFormContainer.style.display = 'block';
                });
        });
    });

    document.getElementById('edit-form').addEventListener('submit', function(event) {
        event.preventDefault();
  
        const id = editProductId.value.trim();
        const name = editnameInput.value.trim();
        const price = editpriceInput.value.trim();
        const image_filename = imageInput.value.split("\\").pop();
        const genre = genreInput.value.trim();
  
        fetch('/edit-product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, genre, price, image_filename, id})
        })
        .then(response => response.json())
        .then(data => {
          nameInput.value = '';
          priceInput.value = '';
          imageInput.value = '';
          genreInput.value = '';
        })
        .catch(error => console.error('Error:', error));
      });
});