'use strict';

const logger = require('fastlog')('sat-api');
const utils = require('./utils.js');
const fs = require('fs');
const html = fs.readFileSync("index.html","utf-8");
const coordinates_page = fs.readFileSync("coordinates.html","utf-8");


/**
 * landsat handler function.
 *
 * @param {object} event - input
 * @param {object} context -
 * @param {function} callback -
 */

module.exports.landsat = (event, context, callback) => {
  logger.info('Received event: ' + JSON.stringify(event));

  if (event.row === '') return callback(new Error('ROW param missing!'));
  if (event.path === '') return callback(new Error('PATH param missing!'));

  utils.get_landsat(event.path, event.row, event.full)
    .then(data => {
      return callback(null, {
        request: { path: event.path, row: event.row },
        meta: { found: data.length },
        results: data
      });
    })
    .catch(err => {
      logger.error(err);
      return callback(new Error('API Error'));
    });
};


module.exports.cbers = (event, context, callback) => {
  logger.info('Received event: ' + JSON.stringify(event));

  if (event.row === '') return callback(new Error('ROW param missing!'));
  if (event.path === '') return callback(new Error('PATH param missing!'));

  utils.get_cbers(event.path, event.row)
    .then(data => {
      return callback(null, {
        request: { path: event.path, row: event.row },
        meta: { found: data.length },
        results: data
      });
    })
    .catch(err => {
      logger.error(err);
      return callback(new Error('API Error'));
    });
};


/**
 * sentinel handler function.
 *
 * @param {object} event - input
 * @param {object} context -
 * @param {function} callback -
 */

module.exports.sentinel = (event, context, callback) => {
  logger.info('Received event: ' + JSON.stringify(event));
  if (event.utm === '') return callback(new Error('UTM param missing!'));
  if (event.lat === '') return callback(new Error('LAT param missing!'));
  if (event.grid === '') return callback(new Error('GRID param missing!'));
  utils.get_sentinel(event.utm, event.lat, event.grid, event.full)
    .then(data => {
      return callback(null, {
        request: { utm: event.utm, lat: event.lat, grid: event.grid},
        meta: { found: data.length },
        results: data
      });
    })
    .catch(err => {
      logger.error(err);
      return callback(new Error('API Error'));
    });
};

module.exports.home = (event, context, callback) => {
  logger.info('Received event: ' + JSON.stringify(event));
  const body = html;
  // const body = '<p>Hello World</p>';
  // callback will send HTML back
  context.succeed(body);
};

module.exports.coordinates = (event, context, callback) => {
  logger.info('Received event: ' + JSON.stringify(event));
  const body = coordinates_page;
  // const body = '<p>Hello World</p>';
  // callback will send HTML back
  context.succeed(body);
};
