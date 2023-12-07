// --------------------------------- GSAP/ScrollTrigger - scrolling and tweens ----------------------------- //

    // Register Plugins
    gsap.registerPlugin(ScrollTrigger); // register the ScrollTrigger plugin first 

    gsap.config({
      autoSleep: 60,
      force3D: "auto",
      nullTargetWarn: false,
        invalidateOnRefresh: true,
        //markers:true
    });

    // Simple Parallax BG
    gsap.to(".parallax-img", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-container",
          // start: "top bottom", // the default values
          // end: "bottom top",
          scrub: true
        }, 
      });

// Run jQuery-specific functions
(function( $ ) {
})( jQuery );