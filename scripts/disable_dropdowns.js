// final scripts after everything else runs.

// function to disable forms and options appropriately

function disableProductsDropdown(){
    let lens = document.getElementById('lens').value;
    let focus = document.getElementById('focus');
    let state = document.getElementById('state');
    let trend = document.getElementById('trend_interval');
    
    // if lens is product or state, focus is enabled.
    if (['product', 'geography'].includes(lens)){
      focus.disabled = false;
    } else {
      focus.disabled = true;
    };
  
    // if lens is product, disable the "no product" focus option, and set it to "debt collection".
    if (lens == 'product'){
      document.getElementById('focus_').disabled = true;
      if (!focus.value){
        focus.value = "Debt collection"
      };
    } else {
      document.getElementById('focus_').disabled = false;
    }
  
    // if lens is state, state selector and trend interval are disabled
    if (lens == 'geography'){
      state.disabled = true;
      trend.disabled = true;
    } else {
      state.disabled = false;
      trend.disabled = false;
    }
  
  };

  document.getElementById('lens').onchange = disableProductsDropdown;
  
  // Set disabled product dropdown on page load.
  disableProductsDropdown();