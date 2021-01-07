<!DOCTYPE html>
<html>

<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
<title>Get CFPB complaint data</title>

<style>
table, tr, td, th {
  border: 1px solid black;
  border-collapse: collapse;
  text-align: right;
  padding: 3px;
}

table {
  max-width: 300px;
}

</style>
</head>

<body>
<p><strong>CFPB_data_downloader</strong></p>

<div id="intro_graf">
<p>This is a very in progress tool for downloading complaint trend data from the Consumer Financial Protection Bureau (CFPB). The site performs a basic request using the CFPB's API, and then makes that data available as a table and CSV for download.</p>
<p>See the code on <a href="https://github.com/gweissman86/cfpb_data_downloader">Github</a>.</p>
</div>

<p><strong>Set trend options:</strong></p>

<form>
  <label for="trend_interval">Trend interval:</label>
  <select id="trend_interval" name="trend_interval">
  </select>  <br><br>
  
  <label for="lens">Lens:</label>
  <select id="lens" name="lens">
  </select>  <br><br>
  <label for="date_received_min">Date min:</label>
  <input type="date" id="date_received_min" name="date_received_min"><br><br>
  <label for="date_received_max">Date max:</label>
  <input type="date" id="date_received_max" name="date_received_max"><br><br>
  
  <input type="submit" value="Submit">
</form> 
<br>
<a id="reset" href="">Reset page</a>

<br><br>
<strong>Results</strong>

<br><br>
<div>
Total complaints: <span id="total_complaints"></span>

<br><br>

Complaints by date:<br>
<a id="dl_complaints_by_date"></a>
<table id="complaints_by_date" >
<tr>
<th>Period beginning</th><th># complaints</th>
</tr>
</table>

<br><br>
Complaints by product:<br>
<a id="dl_complaints_by_product"></a>
<table id="complaints_by_product" >
<tr>
<th>Product name</th><th># complaints</th>
</tr>
</table>
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
const dropdowns = {'trend_interval': ['year', 'quarter', 'month', 'week', 'day'], 'lens': ['overview', 'product']}

for (dropdown in dropdowns){
    for (option of dropdowns[dropdown]){
      let option_el = document.createElement('option');
      option_el.value = option;
      option_el.innerText = option;
      document.getElementById(dropdown).appendChild(option_el);
    };
};

</script>

<script type="text/javascript" src="src/cfpb_script.js"></script>

</body>
</html> 