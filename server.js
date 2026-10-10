const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/auth_routes');
const userRoutes = require('./routes/user_routes');
const productRoutes = require('./routes/product_routes');
const categoryRoutes = require('./routes/category_routes');
const cartRoutes = require('./routes/cart_routes');
const orderRoutes = require('./routes/order_routes');
const storeRoutes = require('./routes/store_routes');
const deliveryRoutes = require('./routes/delivery_routes');
const deliveryPartnerRoutes = require('./routes/delivery_partner_routes');
const paymentRoutes = require('./routes/payment_routes');
const addressRoutes = require('./routes/address_routes');
const notificationRoutes = require('./routes/notification_routes');
const offerRoutes = require('./routes/offer_routes');
const reviewRoutes = require('./routes/review_routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'KiranaMitra API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/delivery-partners', deliveryPartnerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const startServer = async () => {
  let pool;

  try {
    pool = await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code !== 'EADDRINUSE') {
        console.error('Server failed to start:', error.message);
        pool.end().finally(() => {
          process.exitCode = 1;
        });
        return;
      }

      const request = http.get(`http://127.0.0.1:${PORT}/`, (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          let isKiranaMitraApi = false;

          try {
            isKiranaMitraApi = response.statusCode === 200
              && JSON.parse(body).message === 'KiranaMitra API is running.';
          } catch (parseError) {
            isKiranaMitraApi = false;
          }

          pool.end().finally(() => {
            if (isKiranaMitraApi) {
              console.log(`KiranaMitra API is already running on port ${PORT}.`);
              return;
            }

            console.error(`Port ${PORT} is already in use by another process. Stop it or set PORT in .env to a free port.`);
            process.exitCode = 1;
          });
        });
      });

      request.setTimeout(3000, () => request.destroy());
      request.on('error', () => {
        pool.end().finally(() => {
          console.error(`Port ${PORT} is already in use. Stop the process or set PORT in .env to a free port.`);
          process.exitCode = 1;
        });
      });
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    if (pool) {
      await pool.end();
    }
    process.exitCode = 1;
  }
};

startServer();
