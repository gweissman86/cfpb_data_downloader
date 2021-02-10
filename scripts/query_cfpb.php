<?php
// query the CFPB API
// if lens is overview or product, then use the CFPB Trends API URL
// if lens is "by state", then use the geo API, first removing the "by state" lens from $_GET because it doesn't apply.

if ( (!empty($_GET)) && (in_array($_GET['lens'], array('overview', 'product')))  ) {
    $url = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/trends?";
    
    // note that array_filter filters out any blank variable.
    // this is primarily to get rid of blank search terms, which screw up the request
    $requestUrl = $url . http_build_query(array_filter($_GET));

    echo '["' . $requestUrl . '",' . file_get_contents($requestUrl) . "]";
    
} elseif ( (!empty($_GET)) && ($_GET['lens'] == 'by state')  ) {
    unset($_GET['lens']);
    $_GET['product'] = $_GET['focus'];
  
    $url = "https://www.consumerfinance.gov/data-research/consumer-complaints/search/api/v1/geo/states?";
    $requestUrl = $url . http_build_query(array_filter($_GET));
    
    echo '["' . $requestUrl . '",' . file_get_contents($requestUrl) . "]";
    
} else {
    echo 0;
};

?>