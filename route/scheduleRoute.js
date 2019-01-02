const express = require('express');
const { schedule } = require('../controllers/index');
const { scheduleValidator } = require('../validator/index');
const { isset } = require('../libs/helper');
const { startCron, stopCron, reloadCron } = require('../libs/cron');

const app = express.Router();

/**
 *  Schedule Route
 */
app.get('/getScheduleDTL', schedule.getScheduleDTLS());
app.get('/add', schedule.add());
app.post('/deleteJX', schedule.deleteJX());
app.post('/getSchedule', schedule.getSchedule());
app.post('/addAction', scheduleValidator.addScheduleValidator(), schedule.addAction());
app.post('/update', scheduleValidator.update(), schedule.update());
app.get('/', schedule.index());
app.get('/reload', async (req, res) => {
  try {
    await reloadCron();
    res.sendStatus(200).json('OK');
  } catch (err) {
    throw err;
  }
});
app.get('/start/:id*?', (req, res) => {
  const response = isset(req.params.id) ? startCron(req.params.id) : startCron();
  res.sendStatus(200).json(response);
});

app.get('/stop/:id*?', (req, res) => {
  const response = isset(req.params.id) ? stopCron(req.params.id) : stopCron();
  res.sendStatus(200).json(response);
});

module.exports = app;
