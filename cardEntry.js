//CardEntry Construct
function CardEntry(count, name, descriptors){
  this.count = count;
  this.name = name;
  this.descriptors = descriptors;
}

exports.create = function(count, name, descriptors){
  return new CardEntry(count, name, descriptors);
}
