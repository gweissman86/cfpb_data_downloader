// SCRIPT FOR PROCESSING CFPB DATA

// Set reset button
document.getElementById('reset').href = window.location.pathname;

// Make all forms match whatever the query is, to retain state.
function replaceForms(value, key){
    const el = document.getElementById(key);
    el.value = value;
};

const queryString = window.location.search;
const params = new URLSearchParams(queryString);

if (queryString){
    params.forEach((value, key) => replaceForms(value, key))
} else {
  // set default max date to today, and default min date to last year.
  dateMax = new Date();
  dateMin = new Date();
  dateMin.setFullYear(dateMin.getFullYear()-2);
  document.getElementById('date_received_min').value = dateMin.toLocaleDateString('en-CA');
  document.getElementById('date_received_max').value = dateMax.toLocaleDateString('en-CA');
};

// function for switching date to UTC
function standardDate(date){
    let offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offset);
    return date.toLocaleDateString()
  };

// create CSV strings for exporting
const encodeHeader = 'data:text/csv;charset=utf-8,'
let dateCSV = encodeHeader + 'period beginning,complaints';
let productCSV = encodeHeader + 'product,complaints';

// function for creating table
function makeTable(tableTitle, id, headers){
    let tableDiv = document.createElement('div');
    tableDiv.className = 'resultTable';
    tableDiv.innerHTML = `<h3 class="tableTitle">${tableTitle}</h3><a id="dl_${id}"</a>`;
    let tableEl = document.createElement('table');
    tableEl.id = id;
    let headerRow = document.createElement('tr');
    
    for (const header of headers){
        let th = document.createElement('th');
        th.innerText = header;
        headerRow.appendChild(th)
    };

    tableEl.appendChild(headerRow);
    tableDiv.appendChild(tableEl);
    document.getElementById('results').appendChild(tableDiv);
};


if (data) {
    // Load total # of complaints to page
    total_complaints = data['aggregations']['dateRangeArea']['doc_count'];
    document.getElementById('total_complaints').innerHTML = total_complaints.toLocaleString();

    // create the complaints by date table.
    makeTable('Complaints by date', 'complaints_by_date', ['Period beginning', 'Complaints']);
    
    const byDate = data['aggregations']["dateRangeArea"]['dateRangeArea']["buckets"];
    

    for (let dateObj of byDate){
        let row = document.createElement('tr');
        
        let rawDate = new Date(dateObj['key']);
        let date = standardDate(rawDate);
        
        let dateCol = document.createElement('td');
        dateCol.innerText = date;
        row.appendChild(dateCol);

        let complaints = dateObj['doc_count'].toLocaleString();

        let compCol = document.createElement('td');
        compCol.innerText = complaints;
        row.appendChild(compCol);

        table = document.getElementById("complaints_by_date");
        table.appendChild(row);

        // make CSV
        dateCSV += '\n' + date + ',' + String(dateObj['doc_count']);
    };

    // create complaints by product table
    makeTable('Complaints by product', 'complaints_by_product', ['Product', 'Complaints']);
    const byProduct = data['aggregations']['product']['product']['buckets'];

    for (let prodObj of byProduct){
        let row = document.createElement('tr');
        
        let product = prodObj['key'];
                
        let prodCol = document.createElement('td');
        prodCol.innerText = product;
        row.appendChild(prodCol);

        let complaints = prodObj['doc_count'].toLocaleString();

        let compCol = document.createElement('td');
        compCol.innerText = complaints;
        row.appendChild(compCol);

        table = document.getElementById("complaints_by_product");
        table.appendChild(row);

        // make CSV
        productCSV += '\n' + `"${product}"` + ',' + String(prodObj['doc_count']);
    };
    
    // create CSVs
    const encodedDateCSV = encodeURI(dateCSV);
    const date_dl_el = document.getElementById('dl_complaints_by_date');
    date_dl_el.setAttribute('href', encodedDateCSV);
    date_dl_el.setAttribute('download', 'complaints_by_date.csv');
    date_dl_el.innerText = '(Download data)';

    const encodedProdCSV = encodeURI(productCSV);
    const prod_dl_el = document.getElementById('dl_complaints_by_product');
    prod_dl_el.setAttribute('href', encodedProdCSV);
    prod_dl_el.setAttribute('download', 'complaints_by_product.csv');
    prod_dl_el.innerText = '(Download data)';


    //test

};