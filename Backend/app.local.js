const app = require('./webserver');

const port = process.env.PORT || 3000;
const host = process.env.APP_HOST || 'localhost';

app.listen(port, host);
console.log(`Server listening on http://${host}:${port}`);
