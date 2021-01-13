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

// FUNCTION FOR CREATING TABLE
// This is a giant function that makes the table and CSVs and adds everything to the page.
// It's a mess, and there's probably a better way to do this.
function makeTable(tableTitle, id, headers, tableData){

    // prep csv data
    const encodeHeader = 'data:text/csv;charset=utf-8,';
    let CSVstring = encodeHeader + headers.join(',');
    
    // make div and element for table, and add headers.
    let tableDiv = document.createElement('div');
    tableDiv.className = 'resultTable';
    
    let tableEl = document.createElement('table');
    tableEl.id = id;
    let headerRow = document.createElement('tr');
    
    for (const header of headers){
        let th = document.createElement('th');
        th.innerText = header;
        headerRow.appendChild(th)
    };

    tableEl.appendChild(headerRow);


    // loop through data and append data to table
    for (const record of tableData){
        let row = document.createElement('tr');
        
        let col1_data = record['key'];
        
        // if 'key' is a number, then it's a date. convert to date object.
        if (typeof col1_data == 'number'){
            col1_data = new Date(record['key']);
            col1_data = standardDate(col1_data);
        };        
        
        let col1 = document.createElement('td');
        col1.innerText = col1_data;
        row.appendChild(col1);

        let col2_data = record['doc_count'].toLocaleString();

        let col2 = document.createElement('td');
        col2.innerText = col2_data;
        row.appendChild(col2);

        tableEl.appendChild(row);

        // add row to CSV
        CSVstring += '\n' + col1_data + ',' + String(record['doc_count']);
    };
    
    let tableTitleEl = document.createElement('h3');
    tableTitleEl.className = 'tableTitle';
    tableTitleEl.innerText = tableTitle;

    let dlLinkEl = document.createElement('a');

    // create CSV
    const encodedCSV = encodeURI(CSVstring);
    
    dlLinkEl.setAttribute('href', encodedCSV);
    dlLinkEl.setAttribute('download', `${id}.csv`);
    dlLinkEl.innerText = '(Download data)';


    // add to page
    tableDiv.appendChild(tableTitleEl);
    tableDiv.appendChild(dlLinkEl);

    tableDiv.appendChild(tableEl);
    document.getElementById('results').appendChild(tableDiv);
};



if (data) {
    // Load total # of complaints to page
    total_complaints_div = document.createElement('div');    
    total_complaints = data['aggregations']['dateRangeArea']['doc_count'].toLocaleString();
    
    total_complaints_div.innerHTML = `<strong>Total complaints:</strong> ${total_complaints}`;
    document.getElementById('results').appendChild(total_complaints_div);

    
    // create complaints by product table
    const byProduct = data['aggregations']['product']['product']['buckets'];    
    makeTable('Complaints by product', 'complaints_by_product', ['Product', 'Complaints'], byProduct);

    // create complaints by issue table
    
    if (params.get('lens') == 'product'){
        const byIssue = data['aggregations']['issue']['issue']['buckets'];    
        makeTable('Complaints by issue', 'complaints_by_issue', ['Issue', 'Complaints'], byIssue);
    };
    
    // create the complaints by date table.        
    const byDate = data['aggregations']["dateRangeArea"]['dateRangeArea']["buckets"];
    makeTable('Complaints by date', 'complaints_by_date', ['Period beginning', 'Complaints'], byDate); 
    

} else{
    instructions = document.createElement('p');
    instructions.innerHTML = '<em>Submit options to view trend data.</em>';
    document.getElementById('results').appendChild(instructions);
};