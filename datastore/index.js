const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = null;

  counter.getNextUniqueId((err, value) => {
    id = value;

    items[id] = text;

    let newFile = exports.dataDir + '/' + id + '.txt';

    // console.log('items: ', items, 'newFile: ', newFile);

    fs.writeFile(newFile, text, (err) => {

      if (err) {
        throw ('error: could not write the counter');
      } else {
        callback(null, { id, text });
      }
    })


  })

};

exports.readAll = (callback) => {
  // read files (arr of file names) from exports.dataDir (the path as a str)

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error: could not read the directory');
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
      console.log('mappedFiles: ', mappedFiles);
      callback(null, mappedFiles);

      // for each fileName in files (keeping tabs on idx)
      // _.each(files, (fileName, idx) => {

      //   let fullFileName = exports.dataDir + '/' + fileName;

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
  })
};

exports.readOne = (id, callback) => {
  //we would want items  to be populated here to check validity
  // or we can check current files stored?ur call


  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  //read n write to id ref with text
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  //delete the file
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
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
