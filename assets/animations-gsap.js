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
       if(jQuery(box).hasClass('alignright')) {
           var pos_start = "100% 0%";
           var pos_end = "100% 100%";
       }
       else {
           var pos_start = "50% 0%";
           var pos_end = "50% 100%";
       }
       gsap.set(box, {objectPosition: pos_start});
       gsap.to(box, { 

           scrollTrigger: {
               trigger: box, // start the animation when ".box" enters the viewport (once),
               start: "top bottom",
               end: "bottom top",
               scrub: true, 
               toggleClass: "onscreen"
           },        
           objectPosition: pos_end,
           scale: 1.5,
           ease: "none"
       
       })
   });

// Run jQuery-specific functions
(function( $ ) {
})( jQuery );