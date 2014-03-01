//= require app/app.js

App.module('NotificatorView', function(NotificatorView, App, Backbone, Marionette, $, _){

  // NotificatorView: shows notifications through the app mediator.
  NotificatorView.View = Marionette.ItemView.extend({
    template: 'templates/NotificatorTemplate',

    initialize: function(options){
      var that = this;

      options = options || {};
      _.defaults(options,{
        defaultDuration: App.Constants.DEFAULT_NOTIFICATION_DURATION,
        // CSS classes to style different kind of messages
        classNames: {
          'info': 'alert-info',
          'warning': 'alert-warning',
          'success': 'alert-success',
          'error': 'alert-danger'
        }
      });

      this.defaultDuration = options.defaultDuration;
      this.classNames = options.classNames;

      // listen to notification events in app mediator.
      App.vent.on('notification:info', function(message){
        that.info(message);
      });

      App.vent.on('notification:warning', function(message){
        that.warning(message);
      });

      App.vent.on('notification:error', function(message){
        that.error(message);
      });

      App.vent.on('notification:success', function(message){
        that.success(message);
      });
    },

    // Expose message and a className without the need of a model.
    serializeData: function(){
      return {
        message: this.message,
        className: this.notificationType
      };
    },

    // Hides notificator before rendering to achieve a proper fade-in effect
    onBeforeRender: function(){
      this.$el.css({
        opacity: 0.0
      });
    },

    // Shows a message for limited amount of time. Fades in, then fades out.
    show: function(msg, ms, notificationType){
      this.message = msg;
      this.notificationType = this.classNames[notificationType];
      this.render();
      this.$el.fadeTo('fast', 1.0);
      setTimeout(_.bind(this.hide, this), ms || this.defaultDuration);
    },

    hide: function(){
      this.$el.fadeTo('to', 0.0);
    },

    info: function(msg, ms){
      this.show(msg, ms, 'info');
    },

    warning: function(msg, ms){
      this.show(msg, ms, 'warning');
    },

    error: function(msg, ms){
      this.show(msg, ms, 'error');
    },

    success: function(msg, ms){
      this.show(msg, ms, 'success');
    }
  });


});
