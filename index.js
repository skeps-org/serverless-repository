const express = require('express');
const routes = require('./src/routes/index');


const app = express();
const PORT = 5003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/serverless', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
