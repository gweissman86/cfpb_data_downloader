<!DOCTYPE html>
<html>

<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
<title>CFPB trend data downloader</title>

<link rel="stylesheet" href="styles/style.css">
<link rel="icon" 
      type="image/ico" 
      href="https://gideonweissman.com/favicon.ico">

</head>

<body>

<div id="intro" class="primary">
<h1>CFPB trend data downloader</h1>

<p>This is a tool for downloading complaint trend data from the Consumer Financial Protection Bureau (CFPB). The site requests data using the <a href="https://cfpb.github.io/api/ccdb/index.html" target='_blank'>CFPB's API</a>, and then makes that data available as a table and CSV for download.</p>
<p>Bookmark your URL to revisit trend data -- but note that data may change to reflect changes in the database, particularly for recent complaints submitted over the last month.</p>
<p>View and download individual complaints, and use the CFPB's own trends tool (which does not provide a way to downloaded aggregated trend data), on the <a href="https://www.consumerfinance.gov/data-research/consumer-complaints/search/">Consumer Complaint Database homepage</a>.</p>
<p>The code for this page is on <a href="https://github.com/gweissman86/cfpb_data_downloader" target='_blank'>Github</a>.</p>
</div>

<div id="options" class="primary">
<h2> Set trend options</h2>
Set the following options and click submit to view complaint data. Some options will be unavailable depending on the lens selected.

<form>
  
<p><label for="date_received_min">Date min:</label>
  <input type="date" id="date_received_min" name="date_received_min" required></p>

<p><label for="date_received_max">Date max:</label>
  <input type="date" id="date_received_max" name="date_received_max" required><br>
  <span class="form_instructions">Results will include complaints up to, but not including, the "Date max" selection.</span></p>
  
  
<p><label for="lens">Lens:</label>
  <select id="lens" name="lens" onchange="disableProductsDropdown()">
  </select>  <br>
  <span class="form_instructions">Select &ldquo;overview&rdquo; to view complaints for all financial products. Select &ldquo;product&rdquo; to view complaints for a specific product, aggregated by issue and sub-product. Select "by state" to view complaints aggregated by US state.</span></p>

<p><label for="focus">Product:</label>
  <select id="focus" name="focus">
  </select> <br>
  <span class="form_instructions">Leave product blank to see complaints for all products.</span></p>
  </p>  

  <input type="hidden" id="sub_lens_depth" name="sub_lens_depth" value="100">
  <input type="hidden" id="trend_depth" name="trend_depth" value="100">

  <p><label for="state">State:</label>
  <select id="state" name="state">
  </select>  
  <br><span class="form_instructions">Leave state blank to see national complaints.</span>
  </p>

<p><label for="search_term">Search term (optional):</label>
  <input type="text" id="search_term" name="search_term">
  </select>  
  <br><span class="form_instructions">Only return complaints with a complaint narrative containing search term text.</span>
  </p>
  
<p><label for="trend_interval">Trend interval:</label>
  <select id="trend_interval" name="trend_interval">
  </select>  </p>

  <p><input type="submit" value="Submit" style="margin-right:10px;"><a id="reset" class="button" href="" ><button type="button">Reset options</button></a></p>

</form> 

</div>

<div id="results" class="primary">

<h2>Results</h2>



</div>

<?php
// query the CFPB API
// if lens is overview or product, then use the CFPB Trends API URL
// if lens is "by state", then use the geo API, first removing the "by state" lens from $_GET because it doesn't apply.

if ( (!empty($_GET)) && (in_array($_GET['lens'], array('overview', 'product')))  ) {
    $url = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/trends?";
    
    // note that array_filter filters out any blank variable.
    // this is primarily to get rid of blank search terms, which screw up the request
    $requestUrl = $url . http_build_query(array_filter($_GET));
    $response = file_get_contents($requestUrl);
} elseif ( (!empty($_GET)) && ($_GET['lens'] == 'by state')  ) {
    unset($_GET['lens']);
    $_GET['product'] = $_GET['focus'];
  
    $url = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/geo/states?";
    $requestUrl = $url . http_build_query(array_filter($_GET));
    $response = file_get_contents($requestUrl);
    
} else {
    $response = 0;
};

?>

<script>
// initial loading script for the page.

const data = <?php echo $response?>;
const requestUrl = '<?php echo $requestUrl?>';

// set up dropdowns
const products = ['', 'Debt collection', 'Money transfer, virtual currency, or money service', 'Credit reporting, credit repair services, or other personal consumer reports',
 'Checking or savings account', 'Credit card or prepaid card', 'Vehicle loan or lease', 'Mortgage', 'Student loan',
 'Payday loan, title loan, or personal loan']

const states = ['', 'AK','AL','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','PR','RI','SC','SD','TN','TX','UT','VT','VA','VI','WA','WV','WI','WY']

const dropdowns = {'trend_interval': ['year', 'quarter', 'month', 'week', 'day'], 'lens': ['overview', 'product', 'by state'], 'focus': products, 'state':states}

for (dropdown in dropdowns){
    for (option of dropdowns[dropdown]){
      let option_el = document.createElement('option');
      option_el.value = option;
      option_el.innerText = option;
      option_el.id = dropdown + '_' + option;
      document.getElementById(dropdown).appendChild(option_el);
    };
};



</script>
<script type="text/javascript" src="scripts/cfpb_functions.js"></script>
<script type="text/javascript" src="scripts/cfpb_script.js"></script>
<script type="text/javascript" src="scripts/cfpb_after_load.js"></script>


</body>
</html> 
