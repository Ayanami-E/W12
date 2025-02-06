import express from 'express';
import mongoose from 'mongoose';

const app = express();

// MongoDB 数据库连接配置
mongoose.connect('mongodb://127.0.0.1:27017/bookstore', {
  serverSelectionTimeoutMS: 5000,
})
  .then(async () => {
    const db = mongoose.connection.db;

    // 确保连接成功后稍等片刻，确保数据库完全就绪
    setTimeout(async () => {
      try {
        const collections = await db.listCollections({ name: 'books' }).toArray();
        if (collections.length === 0) {
          await db.createCollection('books');
          console.log('Created "books" collection.');
        }
      } catch (error) {
        console.error('Error ensuring "books" collection exists:', error);
      }
    }, 2000); // 延迟 2 秒钟以确保数据库已完全就绪
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Express 路由和其他配置
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(1234, () => {
  console.log('Server running on port 1234');
});
