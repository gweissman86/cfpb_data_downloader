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

<p>This is a (very in progress) tool for downloading complaint trend data from the Consumer Financial Protection Bureau (CFPB). The site performs a basic request using the <a href="https://cfpb.github.io/api/ccdb/index.html">CFPB's API</a>, and then makes that data available as a table and CSV for download.</p>
<p>See the code on <a href="https://github.com/gweissman86/cfpb_data_downloader">Github</a>.</p>
</div>

<div id="options" class="primary">
<h2> Set trend options:</h2>

<form>
  <label for="trend_interval">Trend interval:</label>
  <select id="trend_interval" name="trend_interval">
  </select>  <br><br>
  
  <label for="lens">Lens:</label>
  <select id="lens" name="lens" onload="disableProductsDropdown()", onchange="disableProductsDropdown()">
  </select>  <br><br>
  
  <label for="focus">Product:</label>
  <select id="focus" name="focus">
  </select>  <br><br>

  <label for="date_received_min">Date min:</label>
  <input type="date" id="date_received_min" name="date_received_min"><br><br>
  <label for="date_received_max">Date max:</label>
  <input type="date" id="date_received_max" name="date_received_max"><br><br>
  
  <input type="submit" value="Submit">
</form> 
<br>
<a id="reset" class="button" href="" >Reset page</a>

</div>

<div id="results" class="primary">
<h2>Results</h2>

<div>
<strong>Total complaints:</strong> <span id="total_complaints"></span>

<!-- <br><br>

<strong>Complaints by date:</strong><br>
<a id="dl_complaints_by_date"></a>
<table id="complaints_by_date" >
<tr>
<th>Period beginning</th><th># complaints</th>
</tr>
</table>

<br><br>
<strong>Complaints by product:</strong><br>
<a id="dl_complaints_by_product"></a>
<table id="complaints_by_product" >
<tr>
<th>Product name</th><th># complaints</th>
</tr>
</table> -->

</div>

</div>

<?php
// query the CFPB API
if (!empty($_GET)) {
    $url = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/trends?";
    $response = file_get_contents($url . http_build_query($_GET));
} else {
    $response = 0;
};

?>

<script>
//load data
const data = <?php echo $response?>;

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

<script type="text/javascript" src="src/cfpb_script.js"></script>

<script>
// Set disabled product dropdown on page load.
disableProductsDropdown();
</script>

</body>
</html> 