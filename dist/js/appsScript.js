//  2. Run > setup
//
//  3. Publish > Deploy as web app
//    - enter Project Version name and click 'Save New Version'
//    - set security level and enable service (most likely execute as 'me' and access 'anyone, even anonymously)
//
//  4. Copy the 'Current web app URL' and post this in your form/script action
//
//  5. Insert column names on your destination sheet matching the parameter names of the data you are passing in (exactly matching case)

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

// If you don't want to expose either GET or POST methods you can comment out the appropriate function
function doGet(e){
  return handleResponse(e);
}

function doPost(e){
  return handleResponse(e);
}

function submitToSheet(e, sheetName) {
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(sheetName);
    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = [];
    var output = "";
    // loop through the header columns
    for (i in headers){
      if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
        row.push(new Date());
      } else { // else use header name to get data
        row.push(e.parameter[headers[i]]);
      }
    }
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    output = JSON.stringify({"result":"success", "row": nextRow});
}

function editSheet(e, sheetName, idCol, edittype) {
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(sheetName);

    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var data = doc.getSheetByName(sheetName).getDataRange().getValues();
    var editrow = -1;

    if(sheetName == 'Claims' && edittype == 'claims') {
      for(var i = 1; i < data.length; i++) {
        if(data[i][idCol] == e.parameter['AccountID']) {
          editrow = i;
        }
      }
    }
    if(sheetName == 'Claims' && edittype == 'roles') {
      for(var i = 1; i < data.length; i++) {
        if(data[i][idCol] == e.parameter['AccountID']) {
          editrow = i;
        }
      }
    }
    if(sheetName == 'Businesses' && edittype == 'businesses') {
      for(var i = 1; i < data.length; i++) {
        if(data[i][idCol] == e.parameter['Employer']) {
          editrow = i;
        }
      }
    }
    if(editrow != -1) {
      if(sheetName == 'Claims' && edittype == 'claims') {
        sheet.getRange(editrow+1, 2).setValue(e.parameter['Member']);
        sheet.getRange(editrow+1, 3).setValue(e.parameter['Character']);
        sheet.getRange(editrow+1, 6).setValue(e.parameter['Group']);
        sheet.getRange(editrow+1, 7).setValue(e.parameter['GroupID']);
        sheet.getRange(editrow+1, 8).setValue(e.parameter['Face']);
        sheet.getRange(editrow+1, 9).setValue(e.parameter['Jobs']);
        sheet.getRange(editrow+1, 13).setValue(e.parameter['SubplotRoles']);
      }
      if(sheetName == 'Claims' && edittype == 'roles') {
        sheet.getRange(editrow+1, 13).setValue(e.parameter['SubplotRoles']);
      }
      if(sheetName == 'Businesses' && edittype == 'businesses') {
        sheet.getRange(editrow+1, 8).setValue(e.parameter['Hiring']);
        sheet.getRange(editrow+1, 6).setValue(e.parameter['WeekdayHours']);
        sheet.getRange(editrow+1, 7).setValue(e.parameter['WeekendHours']);
      }
    }
  }


function handleResponse(e) {
  // Google announced the LockService[1]
  // this prevents concurrent access overwritting data
  // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.

  try {
    if(e.parameter['SubmissionType'] == 'claims-submit') {
      submitToSheet(e, 'Claims');
    } else if(e.parameter['SubmissionType'] == 'species-submit') {
      submitToSheet(e, 'Species');
    } else if(e.parameter['SubmissionType'] == 'claims-edit') {
      editSheet(e, 'Claims', 3, 'claims');
    } else if(e.parameter['SubmissionType'] == 'reserve-submit') {
      submitToSheet(e, 'Reserves');
    } else if(e.parameter['SubmissionType'] == 'business-submit') {
      submitToSheet(e, 'Businesses');
    } else if(e.parameter['SubmissionType'] == 'business-edit') {
      editSheet(e, 'Businesses', 0, 'businesses');
    } else if(e.parameter['SubmissionType'] == 'subplot-submit') {
      submitToSheet(e, 'SubplotReserves');
    } else if(e.parameter['SubmissionType'] == 'add-plot-submit') {
      submitToSheet(e, 'Subplots');
    } else if(e.parameter['SubmissionType'] == 'plot-role-submit') {
      editSheet(e, 'Claims', 3, 'roles');
    }
    if (e.parameter.callback){
      // return jsonp success results
      return ContentService
          .createTextOutput(e.parameter.callback+"("+ output + ");")
          .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    else{
      console.log('json');
      // return jsonp success results
      return ContentService
          .createTextOutput(output)
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch(e){
    output = JSON.stringify({"result":"error", "error": e});
    return ContentService
        .createTextOutput(output)
        .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();
  }
}

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}