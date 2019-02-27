settings = new Mongo.Collection('settings');

settings.deny({
  update: function() {
    return true;
  },
  insert: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});
