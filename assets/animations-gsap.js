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

   //Parallax Background
   const bgParallax = gsap.utils.toArray('.parallax-img');
   bgParallax.forEach(box => {
       if(jQuery(box).hasClass('top-banner')) {
           
           var pos_start = "50% 100%";           
           var pos_end = "50% 0%";
           var trigger_start = "top top";
           var trigger_end = "bottom top";
       }
       else {
          
           var pos_start = "50% 100%";
           var pos_end = "50% 0%";
           var trigger_start = "top bottom";
           var trigger_end = "bottom top"
       }
       gsap.set(box, {objectPosition: pos_start});
       gsap.to(box, { 

           scrollTrigger: {
               trigger: box, // start the animation when ".box" enters the viewport (once),
               start: trigger_start,
               end: trigger_end,
               scrub: true, //enable scrub
               toggleClass: "onscreen"
           },        
           objectPosition: pos_end,
           //scale: 1.1,
           ease: "none"
       
       })
   });

// Run jQuery-specific functions
(function( $ ) {
})( jQuery );