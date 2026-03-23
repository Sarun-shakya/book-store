import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

//import routes
import authRoutes from './routes/auth.route.js';
import bookRoutes from './routes/book.route.js';
import categoryRoutes from './routes/category.route.js';
import cartRoutes from './routes/cart.route.js';
import orderRoutes from './routes/order.route.js';

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 3000;

// API Routes
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
// app.use('/api/v1/payments', paymentRoutes);

app.get("/", (req, res) => {
  res.send("Bookstore API is running...");
});

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });
