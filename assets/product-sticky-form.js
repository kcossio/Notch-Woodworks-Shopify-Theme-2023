customElements.define('sticky-product-form', class StickyProductForm extends HTMLElement {
    constructor() {
      super();
      this.stickyForm = this.querySelector('product-form');
      this.variantSelects = this.querySelector('variant-selects');
      this.mainProductSection = null;
      this.stickyPriceContainer = null;
    }

    connectedCallback() {
      this.productForm = document.querySelector('product-form');
      this.productStickyForm = document.querySelector('.product--sticky-form');
      this.productFormBounds = {};
      
      // Setup variant change handling
      if (this.variantSelects) {
        this.mainProductSection = document.querySelector(`#MainProduct-${this.variantSelects.dataset.section}`);
        this.stickyPriceContainer = this.querySelector(`#sticky-price-${this.variantSelects.dataset.section}`);
        
        if (this.mainProductSection) {
          this.mainProductSection.addEventListener('variant:changed', this.handleVariantChange.bind(this));
        }
      }

      this.onScrollHandler = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScrollHandler, false);

      this.createObserver();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this.onScrollHandler);
      if (this.mainProductSection) {
        this.mainProductSection.removeEventListener('variant:changed', this.handleVariantChange);
      }
    }

    handleVariantChange(event) {
      const variant = event.detail.variant;
      
      // Update hidden variant input
      const variantInput = this.querySelector('[data-sticky-variant-input]');
      if (variantInput) {
        variantInput.value = variant.id;
        variantInput.disabled = false;
      }

      // Update price
      if (this.stickyPriceContainer) {
        const mainPriceContainer = document.querySelector(`#price-${this.variantSelects.dataset.section}`);
        if (mainPriceContainer) {
          this.stickyPriceContainer.innerHTML = mainPriceContainer.innerHTML;
        }
      }

      // Update button state
      const addButton = this.querySelector('.product-form__submit');
      if (addButton) {
        const buttonText = variant.available ? window.variantStrings?.addToCart || 'Add to cart' : window.variantStrings?.soldOut || 'Sold out';
        const buttonSpan = addButton.querySelector('span');
        if (buttonSpan) buttonSpan.textContent = buttonText;
        addButton.disabled = !variant.available;
      }
    }

    createObserver() {
      let observer = new IntersectionObserver((entries, observer) => {
        this.productFormBounds = entries[0].isIntersecting;
      });
      observer.observe(this.productForm);
    }

    onScroll() {
      this.productFormBounds ? requestAnimationFrame(this.hide.bind(this)) : requestAnimationFrame(this.reveal.bind(this));
    }

    hide() {
      if(this.productStickyForm.classList.contains('product--sticky-form__active')) {
        this.productStickyForm.classList.remove('product--sticky-form__active');
        this.productStickyForm.classList.add('product--sticky-form__inactive');
      }
    }

    reveal() {
      if(this.productStickyForm.classList.contains('product--sticky-form__inactive')) {
        this.productStickyForm.classList.add('product--sticky-form__active');
        this.productStickyForm.classList.remove('product--sticky-form__inactive');
      }
    }
});