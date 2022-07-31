/* ===================================================================
 * Count - Main JS
 *
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";
    
    var cfg = {
        scrollDuration : 800, // smoothscroll duration
        mailChimpURL   : 'https://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e6957d85dc'   // mailchimp url
    },

    $WIN = $(window);

    // Add the User Agent to the <html>
    // will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);

    // svg fallback
    if (!Modernizr.svg) {
        $(".home-logo img").attr("src", "images/logo.png");
    }


   /* Preloader
    * -------------------------------------------------- */
    var ssPreloader = function() {
        
        $("html").addClass('ss-preload');

        $WIN.on('load', function() {

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('ss-preload');
            $("html").addClass('ss-loaded');
            markdownOnLoad();
        });
    };


   /* info toggle
    * ------------------------------------------------------ */
    var ssInfoToggle = function() {

        //open/close lateral navigation
        $('.info-toggle').on('click', function(event) {

            event.preventDefault();
            $('body').toggleClass('info-is-visible');

        });

    };


   /* slick slider
    * ------------------------------------------------------ */
    var ssSlickSlider = function() {
        
        $('.home-slider').slick({
            arrows: false,
            dots: false,
            autoplay: true,
            autoplaySpeed: 3000,
            fade: true,
            speed: 3000
        });

    };


   /* placeholder plugin settings
    * ------------------------------------------------------ */
    var ssPlaceholder = function() {
        $('input, textarea, select').placeholder();
    };


   /* final countdown
    * ------------------------------------------------------ */
    var ssFinalCountdown = function() {

        var finalDate =  new Date("March 25, 2021 15:37:25").getTime();
        //-date: "Mar 25 2021",

        $('.home-content__clock').countdown(finalDate)
        .on('update.countdown finish.countdown', function(event) {

            var str = '<div class=\"top\"><div class=\"time days\">' +
                      '%D <span>day%!D</span>' + 
                      '</div></div>' +
                      '<div class=\"time hours\">' +
                      '%H <span>H</span></div>' +
                      '<div class=\"time minutes\">' +
                      '%M <span>M</span></div>' +
                      '<div class=\"time seconds\">' +
                      '%S <span>S</span></div>';

            $(this)
            .html(event.strftime(str));

        });
    };


   /* AjaxChimp
    * ------------------------------------------------------ */
    var ssAjaxChimp = function() {
        
        $('#mc-form').ajaxChimp({
            language: 'es',
            url: cfg.mailChimpURL
        });

        // Mailchimp translation
        //
        //  Defaults:
        //	 'submit': 'Submitting...',
        //  0: 'We have sent you a confirmation email',
        //  1: 'Please enter a value',
        //  2: 'An email address must contain a single @',
        //  3: 'The domain portion of the email address is invalid (the portion after the @: )',
        //  4: 'The username portion of the email address is invalid (the portion before the @: )',
        //  5: 'This email address looks fake or invalid. Please enter a real email address'

        $.ajaxChimp.translations.es = {
            'submit': 'Submitting...',
            0: '<i class="fas fa-check"></i> We have sent you a confirmation email',
            1: '<i class="fas fa-exclamation-triangle"></i> You must enter a valid e-mail address.',
            2: '<i class="fas fa-exclamation-triangle"></i> E-mail address is not valid.',
            3: '<i class="fas fa-exclamation-triangle"></i> E-mail address is not valid.',
            4: '<i class="fas fa-exclamation-triangle"></i> E-mail address is not valid.',
            5: '<i class="fas fa-exclamation-triangle"></i> E-mail address is not valid.'
        }
    };


   /* initialize
    * ------------------------------------------------------ */
    (function ssInit() {
        
        ssPreloader();
        ssInfoToggle();
        ssSlickSlider();
        ssPlaceholder();
        ssFinalCountdown();
        ssAjaxChimp();

    })();

    // markdown rendering
    
    async function markdownOnLoad(){
        const md_url = "/README.md";
        const response = await fetch(md_url);
        const contents = await response.text();
        const md_pane = document.getElementById('md_pane');
        const rendered = await render(contents);
        md_pane.innerHTML = rendered;
        // clean up html
        Array.from(
            md_pane.querySelectorAll('[aria-hidden]')
        ).forEach(el => el.parentNode.removeChild(el));
        Array.from(
            md_pane.querySelectorAll('[rel="nofollow"]')
        ).forEach(el => el.removeAttribute('rel'));
        Array.from(
            md_pane.querySelectorAll('div.highlight-source-python')
        ).forEach(el => el.replaceWith(el.firstChild));
        Array.from(
            md_pane.querySelectorAll(
                'a[href^="https://camo.githubusercontent.com"]'
            )
        ).forEach(el => el.replaceWith(el.firstChild));
        Array.from(
            md_pane.querySelectorAll(
                'img[data-canonical-src]'
            )
        ).forEach(
            el => {
                el.setAttribute('src', el.getAttribute('data-canonical-src'));
                el.removeAttribute('data-canonical-src');
            }
        );
    }

    async function render(markdown){
        return (await fetch('https://api.github.com/markdown',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'mode': 'markdown', 'text': markdown})
        })).text();
    }
    
    /* button controls (pre-websocket implementation)
    * --------------------------------------------------------- */
    let capInit = false;
    const capBtn = document.getElementById("capture-btn");
    const strmBtn = document.getElementById("stream-btn");
    const captureURL = "http://192.168.1.203/capture";
    const streamURL = "http://192.168.1.203/no_signal.png";
    capBtn.addEventListener('mousedown', () => {
        if (strmBtn.style.backgroundColor == "salmon") {
            strmBtn.style.backgroundColor = "";
        }

        capBtn.style.backgroundColor = "salmon";
        
        var el = document.getElementById("ArduCAM Feed");
        if (capInit == true) {
            var timeStamp = new Date().getTime();
            var queryString = "?t" + timeStamp;
            el.src = captureURL + queryString;
        }
        else {
            capInit = true;
            el.src = captureURL;
        }
    });

    capBtn.addEventListener('mouseup', () => {
        var delayInMilliseconds = 100;
        setTimeout(function() {
            capBtn.style.backgroundColor = ""}, delayInMilliseconds);
    });

    strmBtn.addEventListener('click', () => {
        if (strmBtn.style.backgroundColor == "salmon") {
            strmBtn.style.backgroundColor = "";
        }
        else {
            strmBtn.style.backgroundColor = "salmon";
        }
        var el = document.getElementById("ArduCAM Feed");
        if (el.src == streamURL) {
            el.src = captureURL;
            capInit = true;
        }
        else {
            el.src = streamURL;
            capInit = false;
        }
        
    });

    
})(jQuery);