document.addEventListener('DOMContentLoaded', () => {

    const filterForm = document.getElementById('filter-form');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const productList = document.getElementById('product-list');

    filterForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const genre = document.getElementById('genre').value;
        const priceMin = document.getElementById('price-min').value;
        const priceMax = document.getElementById('price-max').value;

        fetch(`/api/products?genre=${genre}&price_min=${priceMin}&price_max=${priceMax}`)
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = '';

                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item';
                    productItem.innerHTML = `
                        <img src="/images/${product.image_filename}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>Жанр: ${product.genre}</p>
                        <p class="product-price">Цена: ${product.price} руб.</p>
                    `;
                    productItem.addEventListener('click', () => {
                        window.location.href = `/product/${product.id}`;
                    });
                    productList.appendChild(productItem);
                });
            });
    });

    resetFiltersBtn.addEventListener('click', () => {
        document.getElementById('genre').value = 'all';
        document.getElementById('price-min').value = '';
        document.getElementById('price-max').value = '';

        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = '';

                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item';
                    productItem.innerHTML = `
                        <img src="/images/${product.image_filename}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>Жанр: ${product.genre}</p>
                        <p class="product-price">Цена: ${product.price} руб.</p>
                    `;
                    productItem.addEventListener('click', () => {
                        window.location.href = `/product/${product.id}`;
                    });
                    productList.appendChild(productItem);
                });
            });
    });
});
