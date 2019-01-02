const express = require('express');
const { category } = require('../controllers/index');
const { categoryValidator } = require('../validator/index');

const app = express.Router();


/**
 *  Category Route
 */
app.get('/getCategoryDTL', category.getCategoryDTLS());
app.post('/addJX', categoryValidator.addCategoryValidator(), category.addCategoryJX());
app.get('/getCategoryJX', category.getCategoryJX());
app.post('/deleteCategoryJX', category.deleteCategoryJX());
app.post('/updateJX', categoryValidator.addCategoryValidator(), category.updateCategoryJX());
app.get('/', category.index());

module.exports = app;
