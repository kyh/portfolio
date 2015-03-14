;(function($) {
  'use strict';

  var menuOpen = 0;

  $(document).ready(function(){

    var $whiteFade  = $('#white-fade');
    var $blackFade  = $('#black-fade');
    var $page       = $('#page');
    var $body       = $('body');

    var smoothStateOptions = {
      onStart: {
        prefetch: true,
        pageCacheSize: 4,
        duration: 400,
        render: function (url, $container) {
          content.toggleAnimationClass('is-exiting');
          if (menuOpen) {
            closeMenu();
          }
          toggleFade($whiteFade);
          $body.animate({
            scrollTop: 0
          });
        }
      },
      onProgress: {
        render: function(){}
      },
      onEnd: {
        duration: 0,
        render: function (url, $container, $content) {
          toggleFade($whiteFade);
          $container.html($content);
          $('#nav-menu').click(openMenu);
        }
      }
    };

    var content = $page.smoothState(smoothStateOptions).data('smoothState');
    $('#nav-menu').click(openMenu);

    function openMenu(e, callback){
      if (e) {
        e.preventDefault();
      }
      menuOpen = 1;
      var $mainMenu = $('#main-menu');

      $blackFade.removeClass('display-hide');
      $blackFade.addClass('fade-in');
      $blackFade.click(closeMenu);

      $body.addClass('no-scroll');
      $('.site-wrap').addClass('menu-in');
      $mainMenu.addClass('menu-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
        if (callback) {
          callback();
        }
      });
    }

    function closeMenu(e, callback){
      if (e) {
        e.preventDefault();
      }
      menuOpen = 0;
      var $mainMenu = $('#main-menu');

      $body.removeClass('no-scroll');
      $('.site-wrap').removeClass('menu-in');

      $blackFade.removeClass('fade-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
        $blackFade.addClass('display-hide');
        if (callback) {
          callback();
        }
      });

      $blackFade.unbind('click');
      $mainMenu.removeClass('menu-open');
    }
  
  }); //End document Ready

  function toggleFade (element) {
    if (element.hasClass('display-hide')) {
      element.removeClass('display-hide');
      element.removeClass('fade-out');
    } else {
      element.addClass('fade-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
        element.addClass('display-hide');
      });
    }
  }

})(jQuery);