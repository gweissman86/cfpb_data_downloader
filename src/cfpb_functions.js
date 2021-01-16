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


function makeTableData(tableTitle, id, headers, tableData){

}