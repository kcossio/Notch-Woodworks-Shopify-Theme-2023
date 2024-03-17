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

   // ------ Toggle Items (aka Accordions) --------- //
   window.addEventListener('load', function(event) {
    const items = gsap.utils.toArray("toggle-element toggle-item");

    let lastItem;

    items.forEach((item, i) => {

        item.tl = gsap.timeline({
            paused: true,
            onStart: () => item.classList.add("active")
        })
        .to(item.querySelector(".info"), {
            ease: "Strong.easeInOut",
            duration: 1,
            height: item.querySelector(".content").scrollHeight,
        })
        .from(item.querySelectorAll(".content > p, .content > ul, .content > div"), {
            duration: 0.5,
            x: -40,
            opacity: 0,
            stagger: 0.25,
            ease: "expo"
        }, 0.5);
        
        item.addEventListener("click", e => {

            // Reverse the other animations
            items.forEach(myItem => myItem.tl.reverse());

            if(lastItem) {
                lastItem.classList.remove("active");
                
            } 

            //console.log(item_image);
            
            if(typeof lastItem === "undefined"
            || (lastItem && !lastItem.isSameNode(item))) {
            // Play the clicked item's animation
            items.forEach(myItem => myItem.tl.reverse());
            item.tl.play();
            lastItem = item;
            //console.log('Opened new item');
            } else {
                
            lastItem = undefined;
            //console.log('Same item');
            }
            //console.log(lastItem);

        });
    });


  });
  // End toggle-content

// Run jQuery-specific functions
(function( $ ) {

    /* Footer Toggle Open Title */
	jQuery('.footer-block__heading').click(function () { // Enable the toggle view list for ul.toggle-view for toggle-able lists
        var container = jQuery(this).closest('.footer-block');
       var content = jQuery(this).closest('.footer-block').children('ul');
       jQuery(this).toggleClass('open');
       content.toggleClass('open');
   });

})( jQuery );