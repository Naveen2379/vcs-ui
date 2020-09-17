const path = require('path');
const port = process.env.PORT || 3000;
const express = require('express');
const app = express();

const publicPath = path.join(__dirname, '..', 'build');
console.log(publicPath);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
    console.log(req.baseUrl);
    console.log(path.join(publicPath, 'index.html'));
    res.sendFile(path.join(publicPath, 'build', 'index.html'));
})


app.listen(port, () => {
    console.log(`server is up and running on port ${port}`);
})