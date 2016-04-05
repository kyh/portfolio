;(function($) {
  'use strict';

  var siteLocation  = (location.origin || location.protocol + "//" + location.host);
  var transitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';
  var menuOpen      = 0;

  $(document).ready(function(){
    // Stays contant
    var $whiteFade  = $('#white-fade');
    var $blackFade  = $('#black-fade');
    var $page       = $('#page');
    var $body       = $('body');

    // These elements change when ajaxing in new page
    var $mainMenu   = $('#main-menu');
    var $navMenu    = $('#nav-menu');
    var $siteWrap   = $('.site-wrap');

    var smoothStateOptions = {
      onStart: {
        prefetch: true,
        pageCacheSize: 4,
        duration: 400,
        render: function (url, $container) {
          if (menuOpen) closeMenu();
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
          url = url.substring(0, url.length - 1);

          $container.html($content);
          toggleFade($whiteFade);
          initMenuEvents($content);

          if (url === siteLocation && !isMobile()) launchSquare();
        }
      }
    };

    var content = $page.smoothState(smoothStateOptions).data('smoothState');
    initMenuEvents();

    function initMenuEvents($content){
      if ($content) {
        $siteWrap = $($content[2]);
        $mainMenu = $($content[0]);
        $navMenu  = $siteWrap.find('#nav-menu');
      } else {
        $blackFade.click(closeMenu);
      }

      $navMenu.click(openMenu);
    }

    function openMenu(e){
      menuOpen = 1;

      if (e) e.preventDefault();

      $body.addClass('no-scroll');
      $mainMenu.addClass('menu-open');
      $siteWrap.addClass('menu-in');
      $blackFade.removeClass('display-hide').addClass('fade-in');
    }

    function closeMenu(e){
      menuOpen = 0;

      if (e) e.preventDefault();

      $body.removeClass('no-scroll');
      $mainMenu.removeClass('menu-open');
      $siteWrap.removeClass('menu-in');
      $blackFade.removeClass('fade-in').one(transitionEnd, function(e) {
        $blackFade.addClass('display-hide');
      });
    }

  }); //End document Ready

  function toggleFade(element) {
    if (element.hasClass('display-hide')) {
      element.removeClass('display-hide').removeClass('fade-out');
    } else {
      element.addClass('fade-out').one(transitionEnd, function(e) {
        element.addClass('display-hide');
      });
    }
  }

})(jQuery);
