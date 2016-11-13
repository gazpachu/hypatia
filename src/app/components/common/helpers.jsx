import $ from 'jquery';

// CSS3 animation helper to cleanup classes after animationd ends
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) callback();
        });
    }
});

// Common app methods
module.exports = {
	
	
}