const CardEntry = require('./cardEntry')

//either fetches a matching entry from the given collection or, as a fallback, the searched-for entry
var fetchEntry = function(cardCollection, cardEntry){
  var result = cardEntry;
  if(cardCollection != null && cardCollection.length > 0){
      cardCollection.forEach(function(collectionEntry){
        if(collectionEntry.name === cardEntry.name){
          result = collectionEntry;
        }
      });
  }

  return result;
}

//adds a want to a given List
exports.addCardEntry = function(cardCollection, cardEntry){
  var entry = fetchEntry(cardCollection, cardEntry);

  if(entry === cardEntry){
    //no match was found, has to be added to the collection
    cardCollection[cardCollection.length] = entry;
  } else {
    //match was found and has to be modified
    var oldCountValue = parseInt(entry.count, 10);
    var newCountValue = parseInt(cardEntry.count, 10);
    entry.count = oldCountValue + newCountValue;

    if(cardEntry.edition != null && cardEntry.edition.length > 0){
      entry.edition = cardEntry.edition;
    }

    if(cardEntry.descriptors != null && cardEntry.descriptors.length > 0){
      entry.descriptors = cardEntry.descriptors;
    }
  }

  return cardCollection;
}

//removes a want from a given list
exports.removeCardEntry = function(cardCollection, cardEntry){
  var entry = fetchEntry(cardCollection, cardEntry);

  //match was found and has to be modified
  //otherwise, no match was found and therefore nothing can be removed
  if(entry !== cardEntry){
    var oldCountValue = parseInt(entry.count, 10);
    var newCountValue = parseInt(cardEntry.count, 10);

    if(oldCountValue - newCountValue > 0){
      //entry.count = oldCountValue - newCountValue;
      entry.count = oldCountValue - newCountValue;
    } else {
      cardCollection[cardCollection.indexOf(entry)] = null;
    }
  }

  return cardCollection;
}
