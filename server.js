const express = require('express');
const dotenv = require('dotenv');
const app = require('./app');
const { path } = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const Db = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose
  .connect(
    //'mongodb+srv://Sardar:mKNWSnu6XQEDz4uJ@fypcluster.uf3aw5d.mongodb.net/fypApisCluster?retryWrites=true&w=majority',
    'mongodb+srv://Sardar:mKNWSnu6XQEDz4uJ@fypcluster.uf3aw5d.mongodb.net/fypApisCluster?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }
  )
  .then((con) => {
    console.log('DataBase Connected Successfully');
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log('App is runing /.....');
});
