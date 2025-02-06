// server/app.ts
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
app.use(cors({
 origin: 'http://localhost:3000',
 credentials: true
}));

const connectDB = async () => {
 try {
   await mongoose.connect('mongodb://127.0.0.1:27017/bookstore');
   
   const db = mongoose.connection.db;
   await db.createCollection('books', {
     validator: {
       $jsonSchema: {
         bsonType: "object",
         required: ["name", "author", "pages"],
         properties: {
           name: { bsonType: "string" },
           author: { bsonType: "string" },
           pages: { bsonType: "number" }
         }
       }
     }
   });
   
   console.log('Successfully connected to MongoDB.');
 } catch (error) {
   if (error.code !== 48) {
     console.error('MongoDB connection error:', error);
     process.exit(1);
   }
 }
};

connectDB();

const bookSchema = new mongoose.Schema({
 author: { type: String, required: true },
 name: { type: String, required: true },
 pages: { type: Number, required: true }
}, { collection: 'books' });

const Book = mongoose.model('Book', bookSchema);

app.post('/api/book', async (req, res) => {
 try {
   const book = new Book(req.body);
   const savedBook = await book.save();
   res.status(200).json(savedBook);
 } catch (error) {
   res.status(500).json({ error: 'Error saving book' });
 }
});

const PORT = 1234;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});

mongoose.connection.on('error', (err) => {
 console.error('MongoDB error:', err);
});

process.on('SIGINT', async () => {
 await mongoose.connection.close();
 process.exit(0);
});

export default app;
