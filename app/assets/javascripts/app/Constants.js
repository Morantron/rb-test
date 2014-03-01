//= require app/app.js

App.module('Constants', function(Constants){
    Constants.TITLE_MAX_LENGTH = 255;
    Constants.CONTENT_MAX_LENGTH = 4000;
    Constants.DEFAULT_NOTIFICATION_DURATION = 3000;
    Constants.PAGE_SIZE = 5;
    Constants.WAIT_FOR_RETRY_MS = 1500;
    Constants.EXCERPT_LENGTH = 250;
});
