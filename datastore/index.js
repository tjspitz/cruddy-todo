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

    // console.log(exports.dataDir);
    items[id] = text;


    // console.log('current id', id)
    // console.log('data path TOCREATE', exports.dataDir + '/' + id + '.txt');

    fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        callback(null, { id, text });
      }
    })


  })

};

exports.readAll = (callback) => {
  //get data from exports.dataDir
  // read the data from fs.readDir

  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      throw ('Error!');
    } else {
      //[test1.txt, test2.txt]

      //when do we know when all of the elements are exhausted?
      //idk if the underscore fx allows for index? might need a way to keep track of index
      _.each(data, (fileName, idx) => {
        // items[id] = text;
        fs.readFile(exports.dataDir + '/' + fileName, (err, fileData) => {
          if (err) {
            callback(null, 0);
          } else {
            items[ fileName.replace('.txt', '') ] = fileData;
            if (idx === data.length - 1) {
              console.log('items here: ', items)
              callback(null, items);
            }
          }
        });

      });
      console.log('data here: ', data)
      callback(null, data);
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
