/* ===================================================================
 * ESP8266 ArduCAM Web Server - Main JS
 * ssPreloader, ssInfoToggle, ssSlickSlider, and ssPlaceholder functions
 * taken from Count - Particles template by styleshout
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";
    var cfg = {
        scrollDuration : 800, // smoothscroll duration
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
            // request README.md from server to display on more info page
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


   /* initialize
    * ------------------------------------------------------ */
    (function ssInit() {
        
        ssPreloader();
        ssInfoToggle();
        ssSlickSlider();
        ssPlaceholder();

    })();

    /* request README.md file
    Simon Willison's Render Markdown tool was altered and used 
    here to make the call to the Github Markdown API
    https://til.simonwillison.net/tools/render-markdown
    * ------------------------------------------------------ */
    
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


    /* button controls (stream is does not set up ws yet...)
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