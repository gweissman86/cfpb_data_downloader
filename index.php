<!DOCTYPE html>
<html>

<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
<title>Get CFPB complaint data</title>

<link rel="stylesheet" href="src/style.css">

</head>

<body>

<div id="intro" class="primary">
<h1>CFPB trend data</h1>

<p>This is a (very in progress) tool for downloading complaint trend data from the Consumer Financial Protection Bureau (CFPB). The site requests data using the <a href="https://cfpb.github.io/api/ccdb/index.html" target='_blank'>CFPB's API</a>, and then makes that data available as a table and CSV for download.</p>
<p>The code is on <a href="https://github.com/gweissman86/cfpb_data_downloader" target='_blank'>Github</a>.</p>
</div>

<div id="options" class="primary">
<h2> Set trend options</h2>

<form>
<label for="search_term">Search term (optional):</label>
  <input type="text" id="search_term" name="search_term">
  </select>  <br><br>
  
  <label for="trend_interval">Trend interval:</label>
  <select id="trend_interval" name="trend_interval">
  </select>  <br><br>
  
  <label for="lens" title="Select &ldquo;overview&rdquo; to view all complaints, select &ldquo;product&rdquo; to view sub-products and issues for a specific financial product." class="tooltip">Lens:</label>
  <select id="lens" name="lens" onchange="disableProductsDropdown()">
  </select>  <br><br>
  
  <label for="focus">Product:</label>
  <select id="focus" name="focus">
  </select>  <br><br>  

  <label for="date_received_min">Date min:</label>
  <input type="date" id="date_received_min" name="date_received_min"><br><br>
  <label for="date_received_max">Date max:</label>
  <input type="date" id="date_received_max" name="date_received_max"><br><br>
  
  <input type="hidden" id="sub_lens_depth" name="sub_lens_depth" value="100">
  <input type="hidden" id="trend_depth" name="trend_depth" value="100">

  <input type="submit" value="Submit">

</form> 
<br>
<a id="reset" class="button" href="" >Reset page</a>

</div>

<div id="results" class="primary">
<h2>Results</h2>



</div>

<?php
// query the CFPB API
if (!empty($_GET)) {
    $url = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/trends?";
    
    // note that array_filter filters out any blank variable.
    // this is primarily to get rid of blank search terms, which screw up the request
    $requestUrl = $url . http_build_query(array_filter($_GET));
    $response = file_get_contents($requestUrl);
} else {
    $response = 0;
};

?>

<script>
//load data
const data = <?php echo $response?>;

const requestUrl = '<?php echo $requestUrl?>';

// set up dropdowns
const products = ['Debt collection', 'Money transfer, virtual currency, or money service', 'Credit reporting, credit repair services, or other personal consumer reports',
 'Checking or savings account', 'Credit card or prepaid card', 'Vehicle loan or lease', 'Mortgage', 'Student loan',
 'Payday loan, title loan, or personal loan']

const dropdowns = {'trend_interval': ['year', 'quarter', 'month', 'week', 'day'], 'lens': ['overview', 'product'], 'focus': products}

for (dropdown in dropdowns){
    for (option of dropdowns[dropdown]){
      let option_el = document.createElement('option');
      option_el.value = option;
      option_el.innerText = option;
      document.getElementById(dropdown).appendChild(option_el);
    };
};



function disableProductsDropdown(){
  let lens = document.getElementById('lens');
  let focus = document.getElementById('focus');
  if (lens.value == 'product'){
    focus.disabled = false;
  } else {
    focus.disabled = true;
  }
};

</script>
<script type="text/javascript" src="src/cfpb_functions.js"></script>
<script type="text/javascript" src="src/cfpb_script.js"></script>

<script>
// Set disabled product dropdown on page load.
disableProductsDropdown();

// link to full api response

if (data) {
  const responseDiv = document.createElement('div');
  responseDiv.style.margin='10px 0px';

  const responseA = document.createElement('a')
  responseA.href = requestUrl;
  responseA.innerText = 'View original CFPB API code string JSON response';
  responseA.target = '_blank';
  responseA.style.fontStyle = 'italic';

  responseDiv.appendChild(responseA);
  document.getElementById('results').appendChild(responseDiv);
};

</script>

</body>
</html> 