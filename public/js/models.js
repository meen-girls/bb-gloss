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

Translator.Locale = Ember.Object.extend({
  name: null,
  _id: null
});

Translator.Translation = Ember.Object.extend({
  translations: {},
  locale: null
});