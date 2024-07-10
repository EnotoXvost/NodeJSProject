const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

const urlencodedParser = bodyParser.urlencoded({
  extended: false,
  });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vinyl_store'
});

connection.connect(err => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err.stack);
        return;
    }
    console.log('Подключено к базе данных.');
});


app.get('/api/products/new', (req, res) => {
    const { genre, price_min, price_max } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (genre && genre !== 'all') {
        query += ' AND genre = ?';
        params.push(genre);
    }

    if (price_min) {
        query += ' AND price >= ?';
        params.push(Number(price_min));
    }

    if (price_max) {
        query += ' AND price <= ?';
        params.push(Number(price_max));
    }

    query += ' ORDER BY id DESC LIMIT 6';

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err.stack);
            res.status(500).send('Ошибка сервера');
            return;
        }
        res.json(results);
    });
});

app.get('/api/products', (req, res) => {
    const { genre, price_min, price_max } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (genre && genre !== 'all') {
        query += ' AND genre = ?';
        params.push(genre);
    }

    if (price_min) {
        query += ' AND price >= ?';
        params.push(Number(price_min));
    }

    if (price_max) {
        query += ' AND price <= ?';
        params.push(Number(price_max));
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err.stack);
            res.status(500).send('Ошибка сервера');
            return;
        }
        res.json(results);
    });
});

app.get('/get-products', (req, res) => {
  connection.query('SELECT * FROM products', (error, results) => {
      if (error) {
          console.error('Ошибка при получении товаров:', error);
          res.status(500).send('Ошибка при получении товаров');
      } else {
          res.json(results);
      }
  });
});

app.get('/get-product/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM products WHERE id = ?';
  connection.query(query, [productId], (error, results) => {
      if (error) {
          return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
          return res.status(404).json({ error: 'Product not found' });
      }
      res.json(results[0]);
  });
});

app.post('/edit-product', (req, res) => {
  const { 'product-id': id, 'product-name': name, 'product-price': price, 'product-genre': genre } = req.body;
  let query = 'UPDATE products SET name = ?, price = ?, genre = ? WHERE id = ?';
  const params = [name, price, genre, id];

  if (req.file) {
      query = 'UPDATE products SET name = ?, price = ?, genre = ?, image = ? WHERE id = ?';
      params.push(req.file.filename);
  }

  connection.query(query, params, (error, results) => {
      if (error) {
          return res.status(500).json({ error: error.message });
      }
      res.json({ success: true });
  });
});



app.get('/get-genres', (req, res) => {
  connection.query('SELECT * FROM genres', (error, results) => {
      if (error) {
          console.error('Ошибка при получении жанров:', error);
          res.status(500).send('Ошибка при получении жанров');
      } else {
          res.json(results);
      }
  });
});

app.post('/add-product', urlencodedParser ,(req, res) => {

    const { name, genre, price, image_filename} = req.body;

    const sql = "INSERT INTO products (name, genre, price, image_filename) VALUES (?, ?, ?, ?)";
    connection.query(sql, [name, genre, price, image_filename], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Товар создан' });
    });
  });

  app.post('/edit-product', urlencodedParser ,(req, res) => {

    const { name, genre, price, image_filename, id} = req.body;

    log(req.body);

    const sql = 'UPDATE products SET name = ?, price = ?, genre = ?, image_filename = ? WHERE id = ?';
    connection.query(sql, [name, genre, price, image_filename, id], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Товар создан' });
    });
  });


  app.delete('/delete-products', (req, res) => {
    const selectedProducts = req.body.products;

    if (!selectedProducts || selectedProducts.length === 0) {
        return res.status(400).json({ success: false, message: 'Не выбраны товары для удаления' });
    }

    const query = 'DELETE FROM products WHERE id IN (?)';
    connection.query(query, [selectedProducts], (error, results) => {
        if (error) {
            console.error('Ошибка удаления товаров:', error);
            res.status(500).json({ success: false, message: 'Ошибка удаления товаров' });
        } else {
            console.log('Успешно удалено товаров:', results.affectedRows);
            res.json({ success: true, message: 'Товары успешно удалены' });
        }
    });
});


app.get('/', (req, res) => {
    const productsQuery = 'SELECT * FROM products ORDER BY id DESC LIMIT 6';
    const genresQuery = 'SELECT * FROM genres';
  
    connection.query(productsQuery, (err, products) => {
      if (err) throw err;
      connection.query(genresQuery, (err, genres) => {
        if (err) throw err;
        res.render('index', {
          title: 'Магазин виниловых пластинок',
          products: products,
          genres: genres
        });
      });
    });
  });

app.get('/product/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM products WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err.stack);
            res.status(500).send('Ошибка сервера');
            return;
        }
        if (results.length === 0) {
            res.status(404).render('404', { title: 'Товар не найден' });
            return;
        }
        res.render('product', { title: 'Информация о товаре', product: results[0] });
    });
});


// Обработка регистрации
app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    const checkUserSql = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkUserSql, [username], (err, results) => {
      if (err) throw err;
  
      if (results.length > 0) {
        res.render('register', { message: 'Username already taken' });
      } else {
        const sql = 'INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)';
        connection.query(sql, [username, password, false], (err, result) => {
          if (err) throw err;
          res.redirect('/login');
        });
      }
    });
  });

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    const sql = 'SELECT * FROM users WHERE username = ?';
    connection.query(sql, [username], (err, results) => {
      if (err) throw err;
  
      if (results.length > 0) {
        const user = results[0];
  
        if (password === user.password) {
          req.session.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };
          res.redirect('/profile');
        } else {
          res.render('login', { message: 'Incorrect password' });
        }
      } else {
        res.render('login', { message: 'User not found' });
      }
    });
  });
  
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect('/');
    });
  });

  app.get('/admin', (req, res) => {
    const user = req.session.user;
    if (user && user.isAdmin) {
      const query = 'SELECT * FROM products';
      connection.query(query, (err, results) => {
          if (err) throw err;
          res.render('admin', { products: results });
      });
    } else {
      res.redirect('/');
    }
  });

  app.get('/profile', (req, res) => {
    const user = req.session.user;
    if (user) {
      res.render('profile', { user });
    } else {
      res.redirect('/login');
    }
  });

  app.get('/register', (req, res) => {
    res.render('register', { title: 'Регистрация' });
});

app.get('/login', (req, res) => {
    if (req.session.user) {
      res.redirect('/');
    } else {
      res.render('login', { title: 'Логин' });
    }
  });

app.get('/about', (req, res) => {
    res.render('about', { title: 'О нас' });
});

app.post('/submit-form', (req, res) => {
    const { email, subject, message } = req.body;
    const username = req.session.user ? req.session.user.username : 'Anonymous';
  
    if (!email || !subject || !message) {
      return res.status(400).json({ message: 'Email, subject, and message are required' });
    }
  
    const sql = "INSERT INTO feedback (username, email, subject, message) VALUES (?, ?, ?, ?)";
    connection.query(sql, [username, email, subject, message], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Заявка принята' });
    });
  });

app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Корзина' });
});

app.post('/buy-product/:productId', (req, res) => {
  const productId = req.params.productId;
  const username = req.session.user ? req.session.user.username : 'Anonymous';

  const sql = 'INSERT INTO cart (username, product) VALUES (?, ?)';
  connection.query(sql, [username, productId], (err, result) => {
      if (err) {
          console.error('Ошибка при покупке товара:', err);
          res.status(500).json({ error: 'Ошибка сервера при покупке товара' });
          return;
      }
      res.json({ message: 'Товар успешно куплен' });
  });
});

app.get('/catalog', (req, res) => {
    const productsQuery = 'SELECT * FROM products';
    const genresQuery = 'SELECT * FROM genres';
  
    connection.query(productsQuery, (err, products) => {
      if (err) throw err;
      connection.query(genresQuery, (err, genres) => {
        if (err) throw err;
        res.render('catalog', {
            title: 'Каталог',
          products: products,
          genres: genres
        });
      });
    });
  });


app.use((req, res) => {
    res.status(404).render('404', { title: 'Страница не найдена' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
