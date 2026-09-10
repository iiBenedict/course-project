const express = require('express');

const bookRoutes = require('./src/routes/book.routes');


const app = express();

const PORT = 3000;


app.use(express.json());


app.get('/', (req, res) => {

    res.json({
        message: 'Library Management API is running'
    });

});


app.use('/api/books', bookRoutes);


app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});