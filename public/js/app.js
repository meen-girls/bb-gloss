var Translator = Ember.Application.create({
  rootElement: $('#app')
});


// See models.js for the store.

// Ember.Application.initializer({
//   name: 'store',
//   initialize: function(container, application) {
//     container.register('store:main', Translator.Store);
//     application.inject('route', 'store', 'store:main');
//   }
// });
