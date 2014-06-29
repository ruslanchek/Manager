var App = Ember.Application.create();

App.Router.map(function() {
    this.route("about", { path: "/about" });
});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return ['red', 'yellow', 'blue'];
    }
});