Object.prototype.clone = function() {
  return Object.assign({}, this);
}
Array.prototype.remove = function() {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};
Array.prototype.rearrange = function(old_index, new_index) {
  if (new_index >= this.length) {
    var k = new_index - this.length + 1;
    while (k--) {
      this.push(undefined);
    }
  }
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this;
};