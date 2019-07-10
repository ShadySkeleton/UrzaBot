const CardEntry = require('./cardEntry')

//either fetches a matching entry from the given collection or, as a fallback, the searched-for entry
var fetchEntry = function(cardCollection, cardEntry){
  var result = cardEntry;
  if(cardCollection != null && cardCollection.size > 0){
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
    entry.count += cardEntry.count;
    if(cardEntry.descriptors != null && cardEntry.descriptors.length > 0){
      entry.descriptors = cardEntry.descriptors;
    }

  } else {
    //match was found and has to be modified
    cardCollection[cardCollection.size] = entry;
  }

  return cardCollection;
}

//removes a want from a given list
exports.removeCardEntry = function(cardCollection, cardEntry){
  var entry = fetchEntry(cardCollection, cardEntry);

  //match was found and has to be modified
  //otherwise, no match was found and therefore nothing can be removed
  if(entry !== cardEntry){
    if(entry.count - cardEntry.count > 0){
      entry.count -= cardEntry.count;
    } else {
      cardCollection[cardCollection.indexOf(entry)] = null;
    }
  }

  return cardCollection;
}
