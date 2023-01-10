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

      // console.log('dataDir: ', exports.dataDir, '<<>>', 'files: ', files);

      let mappedFiles = _.map(files, (file, idx) => {
        let fullFileName = exports.dataDir + '/' + file;

        // GOT RID OF THIS AND NOW IT ALL WORKS.....????
        // fs.readFile(fullFileName, (err, fileData) => {
        //   if (err) {
        //     callback(null, 0);
        //   } else {
        //     callback(null, fileData);
        //   }
        // });

        file = file.replace('.txt', '');
        return {id: file, text: file};
      });
      // console.log('mappedFiles: ', mappedFiles);
      callback(null, mappedFiles);

      // for each fileName in files (keeping tabs on idx)
      // _.each(files, (fileName, idx) => {

      //   let fullFileName = exports.dataDir + '/' + fileName;

      //    ***readFile returns a raw buffer if no encoding e.g. 'utf8' is specified in 2nd arg***
      //   fs.readFile(fullFileName, (err, fileData) => {

      //     if (err) {
      //       callback(null, 0);
      //     } else {

      //       items[ fileName.replace('.txt', '') ] = fileData;
      //       if (idx === files.length - 1) {
      //         console.log('items here: ', items)
      //         callback(null, items);
      //       }
      //     }
      //   });

      // });
      // // console.log('files here: ', files)
      // callback(null, files);
    }
  });
};

exports.readOne = (id, callback) => {
  // is working w/ no edits and I am very suspicous of this
  let text = items[id];

  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  //read n write to id ref with text

  let item = items[id];
  // console.log('id: ', id, 'text: ', text, 'items before: ', items);

  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;

    // the 'items' storage now has updated todo item
    // now we have to write that item (overwrite it) on persistent storage
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
  //delete the file


  let item = items[id];
  let deadFile = exports.dataDir + '/' + id + '.txt';

  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    delete items[id];

    // use fs.unlink(file name, callback def) to remove from persistent storage
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
