const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  let id = null;

  counter.getNextUniqueId((err, value) => {
    id = value;
    items[id] = text;

    let newFile = exports.dataDir + '/' + id + '.txt';

    fs.writeFile(newFile, text, (err) => {
      if (err) {
        new Error('Error: could not write the counter!');
      } else {
        callback(null, { id, text });
      }
    })
  });

};

exports.readAll = (callback) => {
  // read files (arr of file names) from exports.dataDir (the path as a str)

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      new Error('Error: could not read the directory!');
    } else {

        // let mappedFiles = _.map(files, (file, idx) => {
        //   let fullFileName = exports.dataDir + '/' + file;

        //   fs.readFile(fullFileName, 'utf8', (err, fileData) => {
        //     if (err) {
        //       callback(null, 0);
        //     } else {
        //       callback(null, fileData);
        //     }
        //   });

        //   file = file.replace('.txt', '');
        //   return {id: file, text: file};

        // });
        //   callback(null, mappedFiles);


      // for each fileName in files (keeping tabs on idx)
      _.each(files, (fileName, idx) => {

        let fullFileName = exports.dataDir + '/' + fileName;

        //  ***readFile returns a raw buffer if no encoding e.g. 'utf8' is specified in 2nd arg***
        fs.readFile(fullFileName, 'utf8', (err, fileData) => {

          if (err) {
            callback(null, 0);
          } else {

            items[ fileName.replace('.txt', '') ] = fileData;
            if (idx === files.length - 1) {
              let itemsForCB = Object.entries(items).map(([key,value]) => ({'id' : key, 'text' : value}));
              callback(null, itemsForCB);
            }
          }
        });

      });

    }

    if(files.length === 0){
      callback(null,[])
    }
  });
};

exports.readOne = (id, callback) => {
  // is working w/ no edits and I am very suspicous of this
  // because we did the readFile thing in readAll but in a way that it works
  let text = items[id];

  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {

  let item = items[id];

  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;

    // the 'items' storage now has updated todo item
    // now we have to overwrite that item in persistent storage
    let newFile = exports.dataDir + '/' + id + '.txt';

    fs.writeFile(newFile, text, (err) => {
      if (err) {
        new Error('Error: could not write this file!');
      } else {
        callback(null, { id, text });
      }
    })
  }
};

exports.delete = (id, callback) => {

  let item = items[id];
  let deadFile = exports.dataDir + '/' + id + '.txt';

  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    delete items[id];

    // use fs.unlink(file name, callback def) to
      // remove from persistent storage
    // unlink only needs an 'err' cb
    fs.unlink(deadFile, (err) => {
      if (err) {
       callback(new Error('Error: could not delete this file!'));
      }
    });
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
