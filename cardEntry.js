//CardEntry Construct
function CardEntry(count, name, edition, descriptors){
  this.count = count;
  this.name = name;
  this.edition = edition;
  this.descriptors = descriptors;
}

exports.create = function(count, name, edition, descriptors){
  return new CardEntry(count, name, edition, descriptors);
}
