'use strict';

const logger = require('fastlog')('sat-api');
const utils = require('./utils.js');
const fs = require('fs');
const sentinel_entry = fs.readFileSync("sentinel-entry.html","utf-8");
const landsat_entry = fs.readFileSync("landsat-entry.html","utf-8");
const cbers_entry = fs.readFileSync("cbers-entry.html","utf-8");
const landsat_results = fs.readFileSync("landsat-results.html","utf-8");


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
      var image_list = data.map(row => {
        return `<p>${row.acquisition_date}</p>
                <img src="${row.browseURL}"/>`
      });
      var template = `
          <!DOCTYPE html>
            <div>
              <h1>
                Welcome to satellite imagery
              </h1>
              <p> Please find your results for row: ${event.row} and path: ${event.path} </p>
              ${image_list}
            </div>`;
      return context.succeed(template);
    })
    .catch(err => {
      logger.error(err);
      return callback(err);
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
  var body;
  if(event.satellite === 'landsat') {
    body = landsat_entry;
  } else if (event.satellite === 'sentinel') {
    body = sentinel_entry;
  } else {
    body = cbers_entry;
  }
  // const body = '<p>Hello World</p>';
  // callback will send HTML back
  context.succeed(body);
};
