// function for switching date to UTC
// this function does 2 things:
// it returns the date in format m/d/y.
// it also will return the min date set, if that date is greater than the date provided.



function standardDate(date){
    date = new Date(date);
    if (minDate > date){date = new Date(minDate.getTime())};

    let offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offset);
    return date.toLocaleDateString()
  };

// FUNCTION FOR CREATING TABLE
// This is a giant function that makes the table and CSVs and adds everything to the page.
// It's a mess, and there's probably a better way to do this.
function makeTable(tableTitle, id, headers, tableData, otherComplaints){

    // prep csv string
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

    // make other doc count
    if (otherComplaints){
        let otherComplaintsObj = {key: 'Other complaints', doc_count: otherComplaints};
        tableData.push(otherComplaintsObj);
    };


    // loop through data and append data to table
    for (const record of tableData){
        let row = document.createElement('tr');
        
        let col1_data = record['key'];
        
        // if 'key' is a number, then it's a date. convert to date object.
        if (typeof col1_data == 'number'){
            // col1_data = new Date(record['key']);
            col1_data = standardDate(col1_data);
        };
        
        let col1 = document.createElement('td');
        col1.className = 'keycell';
        col1.innerText = col1_data;
        row.appendChild(col1);

        let col2_data = record['doc_count'].toLocaleString();

        let col2 = document.createElement('td');
        col2.className = 'datacell';
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
    dlLinkEl.innerText = '(Download as CSV)';


    // add to page
    tableDiv.appendChild(tableTitleEl);
    tableDiv.appendChild(dlLinkEl);

    tableDiv.appendChild(tableEl);
    document.getElementById('results').appendChild(tableDiv);
};

// function for making deep table with multiple keys
function makeMultiTable(tableTitle, id, headers, tableData){
    // prep csv string
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


    // Extract data from table data.
    for (const bucket of tableData){
        key = bucket['key'];
        bucket_periods = bucket['trend_period']['buckets'];

        bucket_periods.sort((a,b) => a['key'] - b['key']);

        // loop through periods within key
        for (const bucket_period of bucket_periods){
            //make table row      
            const row = document.createElement('tr');

            let key_cell = document.createElement('td');
            key_cell.className = 'keycell';
            key_cell.innerText = key;
            row.appendChild(key_cell);

            let date_cell = document.createElement('td');
            date_cell.className = 'keycell';
            date_cell.innerText = standardDate(bucket_period['key']);
            row.appendChild(date_cell)

            let complaints_cell = document.createElement('td');
            complaints_cell.className = 'datacell';
            complaints_cell.innerText = bucket_period['doc_count'].toLocaleString();
            row.appendChild(complaints_cell);

            tableEl.appendChild(row);

            // add row to CSV
            CSVstring += '\n' + key + ',' + standardDate(bucket_period['key']) +',' + String(bucket_period['doc_count']);
        };
    };


    let tableTitleEl = document.createElement('h3');
    tableTitleEl.className = 'tableTitle';
    tableTitleEl.innerText = tableTitle;

    // create csv and download link
    let dlLinkEl = document.createElement('a');
    const encodedCSV = encodeURI(CSVstring);    
    dlLinkEl.setAttribute('href', encodedCSV);
    dlLinkEl.setAttribute('download', `${id}.csv`);
    dlLinkEl.innerText = '(Download as CSV)';


    tableDiv.appendChild(tableTitleEl);
    tableDiv.appendChild(dlLinkEl);
    tableDiv.appendChild(tableEl);
    document.getElementById('results').appendChild(tableDiv);

};