/**
 * Created by michaelshi on 6/14/15.
 */
$(function(){

    //TODO: Break mobile detection out of scroll event handler
    //TODO: Mobile detection on resize
    var cd = false;
    $(document).scroll(function() {
        if (cd)
            return;

        //TODO: DEBUG THIS
        if(findBootstrapEnvironment() == 'xs'){
            //Disable animations on mobile
            activateAllAnimations();
        }else{
            watchAnimations();
            // watchSections();
            watchNavBar();
        }

        cd = true;
        return setTimeout((function() {
            cd = false;
        }), 100);
    });

    //Watch and trigger animation
    var watchAnimationsSeletors = ['.bar'];
    function watchAnimations(){
        for(var es in watchAnimationsSeletors){
            var elements = $(watchAnimationsSeletors[es]);
            for(var i=0; i<elements.length; i++){
                var element = elements.eq(i);
                if(isElementInViewport(element))
                    element.addClass('active');
            }
        }
    }
    function activateAllAnimations(){
        for(var es in watchAnimationsSeletors){
            var elements = $(watchAnimationsSeletors[es]);
            elements.addClass('active');
        }
    }

    //Watch Section for nav bar
    var sectionSelectors = ['#splash', '#innovation', '#prizes', '#faq', '#gadgets', '#organisers'];
    function watchSections(){
        for(var s in sectionSelectors){
            var element = $(sectionSelectors[s]);
            var navElement = $('.dot' + sectionSelectors[s].replace('#', '.'));
            if(isElementInCenter(element)){
                $('.dot').removeClass('active');
                navElement.addClass('active');
            }
        }
    }

    function watchNavBar(){
        $('#nav-bar').affix({
            offset:{
                //Assumes overview is the first section after splash
                top: $('#innovation').offset().top - $('#nav-bar').height()
            }
        });
        $('#nav-bar').on( 'affix.bs.affix', function () {
            console.log($(".hee-logo-main").addClass("hidden"));
            console.log($(".logo").removeClass("hidden"));
        });
        $('#nav-bar').on( 'affixed-top.bs.affix', function () {
            console.log($(".hee-logo-main").removeClass("hidden"));
            console.log($(".logo").addClass("hidden"));
        });
    }

    $(function(){
      $("#gadgets-title").typed({
        strings: [" to revolutionise healthcare education.", 
                  " to innovate with unique solutions.",
                  " to build unique solutions never seen before."],
        typeSpeed: 2,
        backDelay: 2000,
        loop: true
      });
  });
});


/* ========================================================================
 * Bootstrap: affix.js v3.3.4
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.4'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $(document.body).height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

//Check if an element is in the viewport
//By: Dan http://stackoverflow.com/users/139361/dan
//Sauce: http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    if(typeof el == 'undefined')
        return false;

    var rect = el.getBoundingClientRect();

    return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left >= 0 &&
    rect.bottom >= 0 && /*or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

//Check if an element is in the middle of the screen
//Adopted from isElementInViewport
function isElementInCenter (el) {
    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    if(typeof el == 'undefined')
        return false;
    var rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)/2 &&
        rect.bottom >= (window.innerHeight || document.documentElement.clientHeight)/2
    );
}

//TODO: Remove
//jQuery Plugin for On Scrolled Event Delay
//By: jfriend00 http://stackoverflow.com/users/816620/jfriend00
//Sauce: http://stackoverflow.com/questions/7392058/more-efficient-way-to-handle-window-scroll-functions-in-jquery
(function($) {
    var uniqueCntr = 0;
    $.fn.scrolled = function (waitTime, fn) {
        if (typeof waitTime === "function") {
            fn = waitTime;
            waitTime = 500;
        }
        var tag = "scrollTimer" + uniqueCntr++;
        this.scroll(function () {
            var self = $(this);
            var timer = self.data(tag);
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                self.removeData(tag);
                fn.call(self[0]);
            }, waitTime);
            self.data(tag, timer);
        });
    }
})(jQuery);

//Return what bootstrap environment we're in currently
//By: Raphael_ http://stackoverflow.com/users/1661358/raphael
//Sauce: http://stackoverflow.com/questions/14441456/how-to-detect-which-device-view-youre-on-using-twitter-bootstrap-api
function findBootstrapEnvironment() {
    var envs = ['xs', 'sm', 'md', 'lg'];

    $el = $('<div>');
    $el.appendTo($('body'));

    for (var i = envs.length - 1; i >= 0; i--) {
        var env = envs[i];

        $el.addClass('hidden-'+env);
        if ($el.is(':hidden')) {
            $el.remove();
            return env
        }
    };
}

// //Smooth scroll to any link
// //Sauce: https://css-tricks.com/snippets/jquery/smooth-scrolling/
// //TODO: Implement offset and timer through data- attributes
// $(function(){
//     $('a[href*=#]:not([href=#])').on('click', function() {
//         var offset = parseInt($(this).data('offset')) || 0;
//         console.log(offset);
//         if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
//             var target = $(this.hash);
//             target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
//             if (target.length) {
//                 $('html,body').animate({
//                     scrollTop: target.offset().top + offset
//                 }, 1000);
//                 return false;
//             }
//         }
//     });
// });

function scrollToElement(el, offset, delay){
    offset = offset || 0;
    delay = delay || 1000;
    $('html,body').animate({
        scrollTop: el.offset().top+offset
    }, delay);
    return false;
}
