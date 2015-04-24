;(function($) {
  'use strict';

  var siteLocation = location.origin || location.protocol + "//" + location.host;
  var menuOpen = 0;
  var isMobile = detectmob();

  function detectmob() {
     if (window.innerWidth <= 700 || window.innerHeight <= 600) {
       return true;
     } else {
       return false;
     }
  }

  $(document).ready(function(){
    
    if (!isMobile) launchSquare();
    
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
          url = url.substring(0, url.length - 1);
          toggleFade($whiteFade);
          $container.html($content);
          $('#nav-menu').click(openMenu);
          if (url === siteLocation && !isMobile) launchSquare();
        }
      }
    };

    var content = $page.smoothState(smoothStateOptions).data('smoothState');
    $('#nav-menu').click(openMenu);

    function openMenu(e){
      var $mainMenu = $('#main-menu');
      menuOpen = 1;

      if (e) {
        e.preventDefault();
      }

      $blackFade.removeClass('display-hide');
      $blackFade.addClass('fade-in');
      $blackFade.click(closeMenu);

      if (!isMobile) addLinkListener($mainMenu, $blackFade);
      $body.addClass('no-scroll');
      $('.site-wrap').addClass('menu-in');
      $mainMenu.addClass('menu-open');
    }

    function closeMenu(e){
      var $mainMenu = $('#main-menu');
      menuOpen = 0;

      if (e) {
        e.preventDefault();
      }

      $body.removeClass('no-scroll');
      $('.site-wrap').removeClass('menu-in');

      $blackFade.removeClass('fade-in').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
        $blackFade.addClass('display-hide');
      });

      if (!isMobile) removeLinkListener($mainMenu, $blackFade);
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

  function addLinkListener($mainMenu, $blackFade){
    var bgs = $blackFade.find('.fade-bg');
    $mainMenu.find('ul.work')
      .mouseover(function(e){
        _updateBg(e, 'add', $blackFade);
      })
      .mouseout(function(e){
        _updateBg(e, 'remove', $blackFade);
      });

    function _updateBg(e, type, $blackFade){
      var i, k;
      if (e.target.className === 'menu-link' && type === 'add') {
        for (i = 0; i < bgs.length; i++) {
          if (e.target.innerText === bgs[i].dataset.title) {
            $blackFade.addClass('opaque');
            $(bgs[i]).addClass('active');
          }
        }
      } else if (e.target.className === 'menu-link') {
        for (k = 0; k < bgs.length; k++) {
          if (e.target.innerText === bgs[k].dataset.title) {
            $(bgs[k]).removeClass('active');
            $blackFade.removeClass('opaque');
          }
        }
      }
    }
  }

  function removeLinkListener($mainMenu, $blackFade){
    var bgs = $blackFade.find('.fade-bg');
    $blackFade.removeClass('opaque');
    $mainMenu.find('ul').unbind();
    for (var i = 0; i < bgs.length; i++) {
      $(bgs[i]).removeClass('active');
    }
  }

  function launchSquare(){
    var element = document.getElementById('render');
    if (element) {
      var squareGif = new Gif(element);
      squareGif.init()(function(el){
        $(el).addClass('fade-in');
      });
    }
  }

})(jQuery);
