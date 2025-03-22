class StickyVariantSelects extends VariantSelects {
  constructor() {
    super();
    // Override the change event listener to use our own handler
    this.removeEventListener('change', this.onVariantChange);
    this.addEventListener('change', this.onStickyVariantChange.bind(this));
  }

  onStickyVariantChange() {
    this.updateOptions();
    this.updateMasterId();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
      return;
    }

    // Update URL if needed
    this.updateURL();

    // Update our own variant input first
    this.updateVariantInput();

    // Update price and other info through renderProductInfo
    this.renderProductInfo();

    // Find and update the main variant selects
    const mainVariantSelects = document.querySelector(`variant-selects[data-section="${this.dataset.section}"]`);
    if (mainVariantSelects) {
      const mainSelects = mainVariantSelects.querySelectorAll('select');
      const stickySelects = this.querySelectorAll('select');
      
      // Update main form's select values and trigger their native change handlers
      mainSelects.forEach((mainSelect, index) => {
        const stickySelect = stickySelects[index];
        if (stickySelect && mainSelect.value !== stickySelect.value) {
          mainSelect.value = stickySelect.value;
        }
      });

      // Trigger the main form's variant change handler
      mainVariantSelects.onVariantChange();
    }

    // Dispatch our own variant:changed event after main form is updated
    this.dispatchEvent(
      new CustomEvent('variant:changed', {
        detail: {
          variant: this.currentVariant
        },
        bubbles: true,
        cancelable: true
      })
    );
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#sticky-product-form-${this.dataset.section}`
    );
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      if (input) {
        input.value = this.currentVariant.id;
        input.disabled = false;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  updateVariantStatuses() {
    // Override with empty implementation since we don't need to update statuses in the sticky form
    return;
  }

  setUnavailable() {
    const addButton = this.closest('sticky-product-form').querySelector('.product-form__submit');
    const addButtonText = addButton?.querySelector('span');
    if (addButton && addButtonText) {
      addButtonText.textContent = window.variantStrings.unavailable;
      addButton.disabled = true;
    }
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = this.closest('sticky-product-form');
    if (!productForm) return;
    const addButton = productForm.querySelector('.product-form__submit');
    const addButtonText = addButton?.querySelector('span');
    if (!addButton || !addButtonText) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }
  }
}

customElements.define('sticky-variant-selects', StickyVariantSelects);

customElements.define('sticky-product-form', class StickyProductForm extends HTMLElement {
    constructor() {
      super();
      this.stickyForm = this.querySelector('product-form');
      this.variantSelects = this.querySelector('sticky-variant-selects');  // Updated to use sticky-variant-selects
      this.mainProductSection = null;
      this.stickyPriceContainer = null;
    }

    connectedCallback() {
      this.productForm = document.querySelector('product-form');
      this.productStickyForm = document.querySelector('.product--sticky-form');
      this.productFormBounds = {};
      
      // Setup variant change handling
      if (this.variantSelects) {
        const sectionId = this.variantSelects.dataset.section;
        this.mainProductSection = document.querySelector(`#MainProduct-${sectionId}`);
        this.stickyPriceContainer = this.querySelector(`#sticky-price-${sectionId}`);
        
        // Listen for variant changes from both forms
        const mainVariantSelects = document.querySelector(`variant-selects[data-section="${sectionId}"]`);
        if (mainVariantSelects) {
          mainVariantSelects.addEventListener('variant:changed', this.handleVariantChange.bind(this));
        }
        // Listen to our own variant changes too
        this.variantSelects.addEventListener('variant:changed', this.handleVariantChange.bind(this));
      }

      this.onScrollHandler = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScrollHandler, false);

      this.createObserver();
    }

    disconnectedCallback() {
      window.removeEventListener('scroll', this.onScrollHandler);
      const sectionId = this.variantSelects?.dataset.section;
      if (sectionId) {
        const mainVariantSelects = document.querySelector(`variant-selects[data-section="${sectionId}"]`);
        if (mainVariantSelects) {
          mainVariantSelects.removeEventListener('variant:changed', this.handleVariantChange);
        }
        if (this.variantSelects) {
          this.variantSelects.removeEventListener('variant:changed', this.handleVariantChange);
        }
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

      // Update select elements to match main form if the event came from the main form
      if (this.variantSelects && event.target !== this.variantSelects) {
        const mainSelects = document.querySelectorAll(`variant-selects[data-section="${this.variantSelects.dataset.section}"] select`);
        const stickySelects = this.variantSelects.querySelectorAll('select');
        
        mainSelects.forEach((mainSelect, index) => {
          const stickySelect = stickySelects[index];
          if (stickySelect && mainSelect.value !== stickySelect.value) {
            stickySelect.value = mainSelect.value;
          }
        });
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