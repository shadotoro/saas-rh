const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the SaaS RH API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
