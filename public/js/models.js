// Todo: Use this data store.

// Translator.LookupMixin = Ember.Mixin.create({
//   lookup: function(type, id, url, modelType) {
//     var model = null;
//     this[type].forEach(function(item){
//       if (item.get('_id') === id) {
//         model = item;
//       }
//     });
//     if (!model) {
//       var items = Ember.A();
//       var store = this.get('store');
//       return Ember.$.getJSON(url + id).then(function(data) {
//         data.forEach(function(item) {
//           items.pushObject(Translator[modelType].create(item));
//         });
//         store.set(type, items);
//       });
//     }
//     return model;
//   }
// });

// Translator.Store = Ember.Object.extend(Translator.LookupMixin, {
//   clients: [],
//   projects: [],
//   locales: []
// });

Translator.Client = Ember.Object.extend({
  name: null,
  _id: null
});

Translator.Project = Ember.Object.extend({
  name: null,
  _id: null
});

Translator.Key = Ember.Object.extend({
  key: null,
  translations: []
});

Translator.Keys = Ember.Object.extend({
  translations: [],
  _id: null
});

Translator.Keys.reopen({
  createRecord: function(data) {
    var model = Translator.Key.create();
    model.setProperties(data);
    this.get('translations').pushObject(model);
  },
  lookup: function(id) {
    var model = null;
     this.get('translations').forEach(function(item){
       if (item.get('key') === id) {
         model = item;
       }
     });
     return model;
  }
});

Translator.Translation = Ember.Object.extend({
  translations: {},
  locale: null
});

Translator.Languages = [
  'en-US',
  'es-ES',
  'fr-FR',
  'de-DE',
  'ru-ES'
];
