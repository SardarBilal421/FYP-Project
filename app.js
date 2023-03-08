const express = require('express');
const userRouter = require('./Routers/userRoute');
const stampTransRoutes = require('./Routers/stampTransRoutes');
const blockchainMining = require('./Routers/blockchainRoutes');
const appError = require('./utilities/appError');
const globelErrorConrtoller = require('./Controller/errorController');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/stampTrans', stampTransRoutes);
app.use('/api/v1/blockchain', blockchainMining);
app.use('/public', express.static(`${__dirname}/public`));

app.all('*', (req, res, next) => {
  next(
    new appError(`Requested Page : ${req.originalUrl} not on this server`, 404)
  );
});
app.use(globelErrorConrtoller);

module.exports = app;
