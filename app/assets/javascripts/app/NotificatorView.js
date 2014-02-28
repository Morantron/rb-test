//= require app/app.js

App.module('NotificatorView', function(NotificatorView, App, Backbone, Marionette, $, _){
  NotificatorView.View = Marionette.ItemView.extend({
    template: 'templates/NotificatorTemplate',
    initialize: function(options){
      options = options || {};
      _.defaults(options,{
        defaultDuration: 3000
      });

      this.defaultDuration = options.defaultDuration;

      var that = this;

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
    serializeData: function(){
      return {
        message: this.message,
        className: this.notificationType
      };
    },
    onBeforeRender: function(){
      this.$el.hide();
    },
    show: function(msg, ms, notificationType){
      this.message = msg;
      this.notificationType = this.classNames[notificationType];
      this.render();
      this.$el.fadeIn();
      setTimeout(_.bind(this.hide, this), ms || this.defaultDuration);
    },
    hide: function(){
      this.$el.fadeOut();
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

  NotificatorView.View.prototype.classNames = {
    'info': 'alert-info',
    'warning': 'alert-warning',
    'success': 'alert-success',
    'error': 'alert-danger'
  };

});
