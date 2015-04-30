;(function($) {
  'use strict';

  var baseURL       = '/portfolio-jekyll';
  var siteLocation  = (location.origin || location.protocol + "//" + location.host) + baseURL;
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

      if (!isMobile()) addLinkListener($mainMenu, $blackFade);
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
      if (!isMobile()) removeLinkListener($mainMenu, $blackFade);

      $body.removeClass('no-scroll');
      $mainMenu.removeClass('menu-open');
      $siteWrap.removeClass('menu-in');
      $blackFade.removeClass('fade-in').one(transitionEnd, function(e) {
        $blackFade.addClass('display-hide');
      });
    }
  
  }); //End document Ready

  function toggleFade (element) {
    if (element.hasClass('display-hide')) {
      element.removeClass('display-hide').removeClass('fade-out');
    } else {
      element.addClass('fade-out').one(transitionEnd, function(e) {
        element.addClass('display-hide');
      });
    }
  }

  function addLinkListener($mainMenu, $blackFade){
    var bgs = $blackFade.find('.fade-bg');
    $mainMenu.find('ul.work')
      .mouseover(function(e){
        _updateBg(e, 'add', $blackFade, bgs);
      })
      .mouseout(function(e){
        _updateBg(e, 'remove', $blackFade, bgs);
      });
  }

  function _updateBg(e, type, $blackFade, bgs){
    var i;
    if (e.target.className === 'menu-link') {
      for (i = 0; i < bgs.length; i++) {
        if (e.target.innerText === bgs[i].dataset.title) {
          updateBgActions[type]($(bgs[i]), $blackFade);
        } 
      }
    }
  }

  var updateBgActions = {
    add: function(bg, $blackFade){
      bg.addClass('active');
      $blackFade.addClass('opaque'); 
    },
    remove: function(bg, $blackFade){
      bg.removeClass('active');
      $blackFade.removeClass('opaque');
    }
  };

  function removeLinkListener($mainMenu, $blackFade){
    var bgs = $blackFade.find('.fade-bg');
    $blackFade.removeClass('opaque');
    for (var i = 0; i < bgs.length; i++) {
      $(bgs[i]).removeClass('active');
    }
  }

})(jQuery);
