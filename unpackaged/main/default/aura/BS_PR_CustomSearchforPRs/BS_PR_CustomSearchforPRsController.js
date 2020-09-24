({
    doInit: function (component, event, helper) {

        let detailcols = [{
            fieldName: "pr_link", label: "PR Number", type: "url", colKey: "pr_name", exportable: true, typeAttributes: {
                label: { fieldName: 'pr_name' },
                target: '_blank'
            }
        },
        { fieldName: "pr_requestor", label: "PR Requestor", type: "String", wrapText: true, colKey: "pr_requestor", exportable: true },
        { fieldName: "pr_vendor", label: "Vendor Name", type: "String", wrapText: true, colKey: "pr_vendor", exportable: true },
        { fieldName: "prd_brand", label: "Brand", type: "String", wrapText: true, colKey: "prd_brand", exportable: true },
        { fieldName: "pr_status", label: "Status", type: "String", wrapText: true, colKey: "pr_status", exportable: true },
        { fieldName: "pr_amount", label: "Total PR Amount", type: "currency", colKey: "pr_amount", exportable: true },
        { fieldName: "pr_detail_amount", label: "PR Detail Amount", type: "currency", colKey: "pr_detail_amount", exportable: true },
        { fieldName: "prd_gldescription2", label: "GL Description", type: "String", wrapText: true, colKey: "prd_gldescription2", exportable: true },
        { fieldName: "gl_code", label: "GL Code", type: "String", wrapText: true, colKey: "gl_code", exportable: true }];
       
        let attachmentcols = [{
            fieldName: "pr_link", label: "PR Number", type: "url", colKey: "pr_name", wrapText: true, exportable: true, typeAttributes: {
                label: { fieldName: 'pr_name' },
                target: '_blank'
            }
        },
        {
            fieldName: "pra_link", label: "PR Attachment Name", type: "url", colKey: "pra_name", wrapText: true, exportable: true, typeAttributes: {
                label: { fieldName: 'pra_name' },
                target: '_blank'
            }
        },
        {
            fieldName: "pra_attachment", label: "Attachment", type: "url", colKey: "pra_attachment", wrapText: true, exportable: true, typeAttributes: {
                label: "View File",
                target: 'pra_attachment'
            }
        },
        { fieldName: "pra_createddate", label: "Created Date", type: "string", colKey: "pra_createddate", exportable: true }];
       

        //initialise current date variable
        var today = new Date();

        //set the start date to the first day of the current year
        component.set("v.startDate", today.getFullYear() + "-" + "1" + "-" + "1");
        //set the end date to the today's date of the current year
        component.set("v.endDate", today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());

        //setting up the header for detail & attachment lightning datatable
        component.set("v.detailColumns", detailcols);
        component.set("v.attachmentColumns", attachmentcols);

        let startDate = component.get("v.startDate");
        let endDate = component.get("v.endDate");
        let prSearch = '';
        //default search by the date range for the current year
        helper.searchData(component, event, helper, prSearch, startDate, endDate);
    },


    first: function (component, event, helper) { //Pagination
        var fulldata = [];
        //fulldata=component.get("v.detailData"); 
        var filterApplied = component.get("v.recordsFiltered");
        if (filterApplied) {
            fulldata = component.get("v.searchData");
        }
        else {
            fulldata = component.get("v.detailData");
        }
        var pagesize = component.get("v.pagesize");
        component.set("v.start", 0);
        if (fulldata.length >= pagesize) {
            component.set("v.end", pagesize);
        }
        else {
            component.set("v.end", fulldata.length);
        }
        var startindex = component.get("v.start");
        var endindex = component.get("v.end");
        if (startindex == 0) {
            component.set("v.disablefirst", true);
            component.set("v.disableprev", true);
        }
        if (endindex != fulldata.length) {
            component.set("v.disablelast", false);
            component.set("v.disablenext", false);
        }
        component.set("v.filterData", fulldata.slice(startindex, endindex));
    },
    next: function (component, event, helper) { //Pagination
        var startindex = component.get("v.start");
        var endindex = component.get("v.end");
        var pagesize = component.get("v.pagesize");
        var filterApplied = component.get("v.recordsFiltered");
        var fulldata = [];
        if (filterApplied) {
            fulldata = component.get("v.searchData");
            //alert('in loop');
        }
        else {
            fulldata = component.get("v.detailData");
        }
        if (endindex < fulldata.length) {
            startindex = startindex + pagesize;
            component.set("v.start", startindex);

            if ((endindex + pagesize) > fulldata.length) {
                endindex = (endindex + (fulldata.length % pagesize));
                component.set("v.end", endindex);
            }
            else {
                endindex = (endindex + pagesize);
                component.set("v.end", endindex);
            }
        }
        if (startindex != 0) {
            component.set("v.disablefirst", false);
            component.set("v.disableprev", false);
        }
        if (endindex >= fulldata.length) {
            component.set("v.disablelast", true);
            component.set("v.disablenext", true);
        }
        component.set("v.filterData", fulldata.slice(startindex, endindex));
    },
    prev: function (component, event, helper) { //Pagination
        var startindex = component.get("v.start");
        if (startindex > 0) {
            var endindex = component.get("v.end");
            var pagesize = component.get("v.pagesize");
            var fulldata = [];
            var filterApplied = component.get("v.recordsFiltered");
            //fulldata=component.get("v.detailData");
            if (filterApplied) {
                fulldata = component.get("v.searchData");
            }
            else {
                fulldata = component.get("v.detailData");
            }
            startindex = startindex - pagesize;
            component.set("v.start", startindex);
            if (fulldata.length % pagesize == 0) {
                endindex = endindex - pagesize;
            }
            else {
                if ((endindex % pagesize) != 0) {
                    endindex = endindex - (fulldata.length % pagesize);
                }
                else {
                    endindex = endindex - pagesize;
                }
            }
            component.set("v.end", endindex);
        }
        if (startindex == 0) {
            component.set("v.disablefirst", true);
            component.set("v.disableprev", true);
        }
        if (endindex != fulldata.length) {
            component.set("v.disablelast", false);
            component.set("v.disablenext", false);
        }
        component.set("v.filterData", fulldata.slice(startindex, endindex));
    },
    last: function (component, event, helper) { //Pagination
        var startindex = component.get("v.start");
        var endindex = component.get("v.end");
        var pagesize = component.get("v.pagesize");
        var fulldata = [];
        var filterApplied = component.get("v.recordsFiltered");
        //fulldata=component.get("v.detailData");
        if (filterApplied) {
            fulldata = component.get("v.searchData");
        }
        else {
            fulldata = component.get("v.detailData");
        }
        if (fulldata.length % pagesize == 0) {
            startindex = fulldata.length - pagesize;
        }
        else {
            startindex = fulldata.length - (fulldata.length % pagesize);
        }
        component.set("v.start", startindex);
        endindex = fulldata.length;
        component.set("v.end", endindex);

        if (startindex != 0) {
            component.set("v.disablefirst", false);
            component.set("v.disableprev", false);
        }
        if (endindex == fulldata.length) {
            component.set("v.disablelast", true);
            component.set("v.disablenext", true);
        }
        component.set("v.filterData", fulldata.slice(startindex, endindex));
    },

    //atachement pagination starts
    firstAtt: function (component, event, helper) { //Pagination
        var fulldata = [];
        //fulldata=component.get("v.detailData"); 
        var filterApplied = component.get("v.recordsFiltered");
        if (filterApplied) {
            fulldata = component.get("v.searchAttachmentData");
        }
        else {
            fulldata = component.get("v.attachmentData");
        }
        var pagesize = component.get("v.pagesizeAtt");
        component.set("v.startAtt", 0);
        if (fulldata.length >= pagesize) {
            component.set("v.endAtt", pagesize);
        }
        else {
            component.set("v.endAtt", fulldata.length);
        }
        var startindex = component.get("v.startAtt");
        var endindex = component.get("v.endAtt");
        if (startindex == 0) {
            component.set("v.disablefirstAtt", true);
            component.set("v.disableprevAtt", true);
        }
        if (endindex != fulldata.length) {
            component.set("v.disablelastAtt", false);
            component.set("v.disablenextAtt", false);
        }
        component.set("v.filterAttachmentData", fulldata.slice(startindex, endindex));
    },
    nextAtt: function (component, event, helper) { //Pagination
        var startindex = component.get("v.startAtt");
        var endindex = component.get("v.endAtt");
        var pagesize = component.get("v.pagesizeAtt");
        var filterApplied = component.get("v.recordsFiltered");
        var fulldata = [];
        if (filterApplied) {
            fulldata = component.get("v.searchAttachmentData");
            //alert('in loop');
        }
        else {
            fulldata = component.get("v.attachmentData");
        }
        if (endindex < fulldata.length) {
            startindex = startindex + pagesize;
            component.set("v.startAtt", startindex);

            if ((endindex + pagesize) > fulldata.length) {
                endindex = (endindex + (fulldata.length % pagesize));
                component.set("v.endAtt", endindex);
            }
            else {
                endindex = (endindex + pagesize);
                component.set("v.endAtt", endindex);
            }
        }
        if (startindex != 0) {
            component.set("v.disablefirstAtt", false);
            component.set("v.disableprevAtt", false);
        }
        if (endindex >= fulldata.length) {
            component.set("v.disablelastAtt", true);
            component.set("v.disablenextAtt", true);
        }
        component.set("v.filterAttachmentData", fulldata.slice(startindex, endindex));
    },
    prevAtt: function (component, event, helper) { //Pagination
        var startindex = component.get("v.startAtt");
        if (startindex > 0) {
            var endindex = component.get("v.endAtt");
            var pagesize = component.get("v.pagesizeAtt");
            var fulldata = [];
            var filterApplied = component.get("v.recordsFiltered");
            //fulldata=component.get("v.detailData");
            if (filterApplied) {
                fulldata = component.get("v.searchAttachmentData");
            }
            else {
                fulldata = component.get("v.attachmentData");
            }
            startindex = startindex - pagesize;
            component.set("v.startAtt", startindex);
            if (fulldata.length % pagesize == 0) {
                endindex = endindex - pagesize;
            }
            else {
                if ((endindex % pagesize) != 0) {
                    endindex = endindex - (fulldata.length % pagesize);
                }
                else {
                    endindex = endindex - pagesize;
                }
            }
            component.set("v.endAtt", endindex);
        }
        if (startindex == 0) {
            component.set("v.disablefirstAtt", true);
            component.set("v.disableprevAtt", true);
        }
        if (endindex != fulldata.length) {
            component.set("v.disablelastAtt", false);
            component.set("v.disablenextAtt", false);
        }
        component.set("v.filterAttachmentData", fulldata.slice(startindex, endindex));
    },
    lastAtt: function (component, event, helper) { //Pagination
        var startindex = component.get("v.startAtt");
        var endindex = component.get("v.endAtt");
        var pagesize = component.get("v.pagesizeAtt");
        var fulldata = [];
        var filterApplied = component.get("v.recordsFiltered");
        //fulldata=component.get("v.detailData");
        if (filterApplied) {
            fulldata = component.get("v.searchAttachmentData");
        }
        else {
            fulldata = component.get("v.attachmentData");
        }
        if (fulldata.length % pagesize == 0) {
            startindex = fulldata.length - pagesize;
        }
        else {
            startindex = fulldata.length - (fulldata.length % pagesize);
        }
        component.set("v.startAtt", startindex);
        endindex = fulldata.length;
        component.set("v.endAtt", endindex);

        if (startindex != 0) {
            component.set("v.disablefirstAtt", false);
            component.set("v.disableprevAtt", false);
        }
        if (endindex == fulldata.length) {
            component.set("v.disablelastAtt", true);
            component.set("v.disablenextAtt", true);
        }
        component.set("v.filterAttachmentData", fulldata.slice(startindex, endindex));
    },
    //attachment pagination ends

    //filter the data using custom UI filters
    filterData: function (component, evt, helper) {
        helper.columnData(component, evt, helper);
    },

    // check the server side date filters are valid
    handleStDateCahngeEvent: function (component, event, helper) {
        debugger;
        let startDate = component.get("v.startDate");
        let endDate = component.get("v.endDate");
        if(startDate == null || endDate == null)
            component.set("v.isDateValid", false);
        else
            component.set("v.isDateValid", true);
    },

    //handles search button click
    searchPRs: function (component, event, helper) {
        let prSearch = component.get("v.prSearch");
        let searchKey = (prSearch == null || prSearch == 'null') ? '' : prSearch;
        let startDate = component.get("v.startDate");
        let endDate = component.get("v.endDate");

        //reset all the filters to get the fresh set of data
        helper.resetFilters(component);

        if (true && (searchKey == '' || (searchKey != '' && prSearch.length > 1))) {
            helper.searchData(component, event, helper, searchKey, startDate, endDate);
        }
        else {
            alert('You must enter a valid search key with at least 2 characters.');
        }
    },

    // function automatic called by aura:waiting event  
    showSpinner: function (component, event, helper) {
        // remove slds-hide class from mySpinner
        var spinner = component.find("mySpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },

    // function automatic called by aura:doneWaiting event 
    hideSpinner: function (component, event, helper) {
        // add slds-hide class from mySpinner    
        var spinner = component.find("mySpinner");
        $A.util.addClass(spinner, "slds-hide");
    },

    // ## function call on Click on the "Download As Excel" Button. 
    downloadExcel: function (component, event, helper) {

        debugger;
        var prData, attData; 
        var recordFiltered = component.get("v.recordsFiltered");
        /*
        var clickedBtn = event.getSource().getLocalId();
        if(clickedBtn == 'export'){
        */
        if(recordFiltered){
            // get the Records list from 'searchData' attribute 
            prData = component.get("v.searchData");   
            // get the Records list from 'searchAttachmentData' attribute 
            attData = component.get("v.searchAttachmentData"); 
        }
        else{
            // get the Records list from 'detailData' attribute      
            prData = component.get("v.detailData");
            // get the Records list from 'attachmentData' attribute              
            attData = component.get("v.attachmentData");
        }

        //get the columns for detail & attachment data-table
        var prDataCols = component.get("v.detailColumns");
        var attDatacols = component.get("v.attachmentColumns");

        // check if "objectRecords" is null, then return from function
        if (prData == null || !prData.length) { return; }

        // call the helper function which "return" the excel data as a array of object   
        let createXLSLFormatObj = helper.convertArrayOfObjectsToExcel(component, prData, prDataCols, attData, attDatacols);
        if (createXLSLFormatObj == null) { return; }

        //Creating the instance of XLSX object rendered from Static resources
        const XLSX = window.XLSX;

        //Setting up the name for Detail & Attachment excel sheet
        var sheetName = [];
        sheetName.push('PR Details');
        sheetName.push('PR Attachments');

        /* creating new Excel */
        var wb = XLSX.utils.book_new();

        /* creating new worksheet */
        var ws = Array(createXLSLFormatObj.length).fill([]);
        for (let i = 0; i < ws.length; i++) {
            /* converting data to excel format and puhing to worksheet */
            let data = XLSX.utils.aoa_to_sheet(createXLSLFormatObj[i]);
            //pushing the data in worksheet  
            ws[i] = [...ws[i], data];

            var rowNum, colNum;
            var range = XLSX.utils.decode_range(ws[i][0]['!ref']);
            for (rowNum = 1; rowNum <= range.e.r; rowNum++) {
                for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
                    debugger;
                    //initialize variable
                    var hypIndex = null;
                    var downLoadfileLink = false;

                    //get the respective hyperlink cell from worksheet range
                    switch (i) {
                        case 0:
                            if(colNum == 0)
                                hypIndex = range.e.c;
                                break;
                        case 1:
                            switch (colNum){
                                case 0:
                                    hypIndex = range.e.c - 1;
                                    break;
                                case 1:
                                    hypIndex = range.e.c;
                                    break;
                                case 2:
                                    hypIndex = range.e.c - 3;
                                    downLoadfileLink = true;
                                    break;
                                default:
                                    break;
                            }
                        default:
                            break;
                    }

                    //check hyperlink index and encode the range to add hyperlink
                    if (hypIndex != null) {
                        //cell to add hyperlink
                        var cellText = ws[i][0][
                            XLSX.utils.encode_cell({ r: rowNum, c: colNum })
                        ];
                        // cell hyperlink unique value
                        var cellLink = ws[i][0][
                            XLSX.utils.encode_cell({ r: rowNum, c: hypIndex })
                        ];

                        // to make sure cell text and link both are found
                        if (typeof cellText != 'undefined' && typeof cellLink != 'undefined') {
                            if (!downLoadfileLink)
                                // set the cell hyperlink property 
                                cellText['l'] = { Target: window.location.origin + cellLink.v };
                            else {
                                // set the cell text & hyperlink property
                                cellText['l'] = { Target: cellLink.v };
                                cellText.v = 'View File';
                            }
                        }
                        //reset the 
                        hypIndex = null;
                    }
                }
            }

            /*remove the unique ID columns to make hyperlinks, write new range to the worksheet  */
            range.e.c -= (i==0 ? 1 : 2);
            if (range.e.c < range.s.c) range.e.c = range.s.c;
            ws[i][0]["!ref"] = XLSX.utils.encode_range(helper.clampRange(range));


            /* Add worksheet to Excel */
            XLSX.utils.book_append_sheet(wb, ws[i][0], sheetName[i]);
        }

        let current_datetime = new Date();
        let formatted_date =  (current_datetime.getMonth() + 1) + "-" +  current_datetime.getDate() + "-" + current_datetime.getFullYear()  + " " + current_datetime.getHours() + "-" + current_datetime.getMinutes() + "-" + current_datetime.getSeconds(); 
        
        var xlsxName = "PRDetails " + formatted_date + ".xlsx";
        /* Write Excel and Download */
        XLSX.writeFile(wb, xlsxName);

    },
})