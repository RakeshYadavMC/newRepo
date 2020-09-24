({
    searchData: function (component, event, helper, searchKey, startDate, endDate) {
        //executing an Apex Method through our new utility:
        helper.apex(component, "fetchPRWrapper", { searchKey: searchKey, startDate: startDate, endDate: endDate })
        .then(function (respData) {
            //make result operations here:
            //contains response from payload, both detail and attachment array of objects
            debugger;
            component.set("v.searchClicked", true);
            console.log(respData);
            
            let respDetailData = respData.flatMap(cg => cg.prdetails);
            let respAttachmentData = respData.flatMap(cg => cg.prattachments);

            component.set("v.detailData", respDetailData);
            component.set("v.attachmentData", respAttachmentData);
            //component.set("v.filterAttachmentData", respAttachmentData);


            component.set("v.pagesize", parseInt(component.get("v.pagesize")));
            var fulldata = component.get("v.detailData");
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
            else {
                component.set("v.disablefirst", false);
                component.set("v.disableprev", false);
            }
            if (endindex >= fulldata.length) {
                component.set("v.disablelast", true);
                component.set("v.disablenext", true);
            }
            else {
                component.set("v.disablelast", false);
                component.set("v.disablenext", false);
            }

            component.set('v.filterData', fulldata.slice(startindex, endindex));

            //attachment data
            component.set("v.pagesizeAtt", parseInt(component.get("v.pagesizeAtt")));
            var fullAttData = component.get("v.attachmentData");
            var pagesizeAtt = component.get("v.pagesizeAtt");
            component.set("v.startAtt", 0);
            if (fullAttData.length >= pagesizeAtt) {
                component.set("v.endAtt", pagesizeAtt);
            }
            else {
                component.set("v.endAtt", fullAttData.length);
            }
            var startindexAtt = component.get("v.startAtt");
            var endindexAtt = component.get("v.endAtt");

            if (startindexAtt == 0) {
                component.set("v.disablefirstAtt", true);
                component.set("v.disableprevAtt", true);
            }
            else {
                component.set("v.disablefirstAtt", false);
                component.set("v.disableprevAtt", false);
            }
            if (endindexAtt >= fullAttData.length) {
                component.set("v.disablelastAtt", true);
                component.set("v.disablenextAtt", true);
            }
            else {
                component.set("v.disablelastAtt", false);
                component.set("v.disablenextAtt", false);
            }

            component.set('v.filterAttachmentData', fullAttData.slice(startindexAtt, endindexAtt));
        })
        .catch(function (error) {
            //write about the error
            component.set("v.showErrors", true);
            console.log('Operation error: ' + error);
        })
    },

    columnData: function (component, event, helper) {
        var searchNameText = component.get('v.searchName');
        var searchVendorText = component.get('v.searchVendor');
        var searchBrandText = component.get('v.searchBrand');
        var searchGLDescText = component.get('v.searchGLDesc');
        var searchStatusText = component.get('v.searchStatus');
        var searchGLCodeText = component.get('v.searchGLCode');  

        var searchErrmsg = '';
        debugger;
        var filterSearchData = component.get("v.detailData");
        component.set("v.recordsFiltered", false);
        //arun sharma
        //component.set('v.filterData', filterSearchData);

        //attachement
        var filterSearchAttData = component.get("v.attachmentData");
        //component.set('v.filterAttachmentData', filterSearchAttData);

        if (!$A.util.isEmpty(searchNameText)) {
            component.set("v.recordsFiltered", true);
            filterSearchData = filterSearchData.filter(rec => (rec.pr_name.toLowerCase().includes(searchNameText.toLowerCase())));
        }
        if (!$A.util.isEmpty(searchVendorText)) {
            component.set("v.recordsFiltered", true);
            filterSearchData = filterSearchData.filter(rec => (rec.pr_vendor.toLowerCase().includes(searchVendorText.toLowerCase())));
        }
        if (!$A.util.isEmpty(searchBrandText)) {
            component.set("v.recordsFiltered", true);
            filterSearchData = filterSearchData.filter(rec => (rec.prd_brand.toLowerCase().includes(searchBrandText.toLowerCase())));
        }
        if (!$A.util.isEmpty(searchGLDescText)) {
            component.set("v.recordsFiltered", true);
            filterSearchData = filterSearchData.filter(rec => (rec.prd_gldescription2.toLowerCase().includes(searchGLDescText.toLowerCase())));
        }
        if (!$A.util.isEmpty(searchStatusText)) {
            component.set("v.recordsFiltered", true);
            filterSearchData = filterSearchData.filter(rec => (rec.pr_status.toLowerCase().includes(searchStatusText.toLowerCase())));
        }
        if (!$A.util.isEmpty(searchGLCodeText)) {
            component.set("v.recordsFiltered", true);
            filterSearchData = filterSearchData.filter(rec => (rec.gl_code.toLowerCase().includes(searchGLCodeText.toLowerCase())));
        }

        if (!$A.util.isEmpty(filterSearchData)) {
            component.set("v.searchData", filterSearchData);
            let fulldata = filterSearchData;
            let pagesize = parseInt(component.get("v.pagesize"))
            let recordCount = fulldata.length;
            let totalPages = Math.ceil(recordCount / pagesize);

            component.set("v.start", 0);
            if (fulldata.length >= pagesize) {
                component.set("v.end", pagesize);
            }
            else {
                component.set("v.end", fulldata.length);
            }
            var startindex = component.get("v.start");
            var endindex = component.get("v.end");
            component.set("v.disablefirst", false);
            component.set("v.disableprev", false);
            component.set("v.disablelast", false);
            component.set("v.disablenext", false);

            if (startindex == 0) {
                component.set("v.disablefirst", true);
                component.set("v.disableprev", true);
            }
            else {
                component.set("v.disablefirst", false);
                component.set("v.disableprev", false);
            }
            if (fulldata.length == 0) {
                component.set("v.disablelast", true);
                component.set("v.disablenext", true);
            }
            else {
                component.set("v.disablelast", false);
                component.set("v.disablenext", false);
            }

            let filterData = fulldata.slice(startindex, endindex);
            component.set('v.filterData', filterData);
        }

        if (!$A.util.isEmpty(filterSearchData) && !$A.util.isEmpty(filterSearchAttData)) {
            // Use filterSearchData map to get a simple array of "pr_name" values. Ex: [PR-0001,PR-0002]
            let prNameFilteredData = filterSearchData.map(itemY => { return itemY.pr_name; });
            console.log(prNameFilteredData);

            // Use filter and "not" includes to filter the full dataset by the filter dataset's val.
            filterSearchAttData = filterSearchAttData.filter(rec => prNameFilteredData.includes(rec.pr_name));
            this.columnAttData(component, event, helper, filterSearchAttData);
        }
    },

    //filter attachment data based upon the details
    columnAttData: function (component, event, helper, filterSearchAttData) {
        component.set("v.searchAttachmentData", filterSearchAttData);
        let fulldata = filterSearchAttData;
        let pagesize = parseInt(component.get("v.pagesizeAtt"))
        let recordCount = fulldata.length;
        let totalPages = Math.ceil(recordCount / pagesize);

        component.set("v.startAtt", 0);
        if (fulldata.length >= pagesize) {
            component.set("v.endAtt", pagesize);
        }
        else {
            component.set("v.endAtt", fulldata.length);
        }
        var startindex = component.get("v.startAtt");
        var endindex = component.get("v.endAtt");
        component.set("v.disablefirstAtt", false);
        component.set("v.disableprevAtt", false);
        component.set("v.disablelastAtt", false);
        component.set("v.disablenextAtt", false);

        if (startindex == 0) {
            component.set("v.disablefirstAtt", true);
            component.set("v.disableprevAtt", true);
        }
        else {
            component.set("v.disablefirstAtt", false);
            component.set("v.disableprevAtt", false);
        }
        if (fulldata.length == 0) {
            component.set("v.disablelastAtt", true);
            component.set("v.disablenextAtt", true);
        }
        else {
            component.set("v.disablelastAtt", false);
            component.set("v.disablenextAtt", false);
        }

        let filterData = fulldata.slice(startindex, endindex);
        component.set('v.filterAttachmentData', filterData);
    },

    //convert the detail & attachment data in excel format based upon the exportable columns
    convertArrayOfObjectsToExcel: function (component, prData, prDataCols, attData, attDatacols) {
        // declare variables
        var prDataColKeys, prDataHypColKeys, prDataLabels, attDatacolKeys, attDataHypColKeys, attDataLabels, dataKeys, xlsHeader, xlsData;

        // get the colkey list from 'prDataCols' attribute 
        prDataColKeys = prDataCols.filter(el => el.exportable == true).map(res => { return res.colKey });
        prDataHypColKeys = prDataCols.filter(el => el.exportable == true && el.type == 'url').map(res => { return res.fieldName });
        prDataColKeys.push(...prDataHypColKeys);

        prDataLabels = prDataCols.filter(el => el.exportable == true).map(res => { return res.label });
        prDataLabels.push(...prDataHypColKeys);

        // get the colkey list from attDatacols' attribute 
        attDatacolKeys = attDatacols.filter(el => el.exportable == true).map(res => { return res.colKey });
        attDataHypColKeys = attDatacols.filter(el => el.exportable == true && el.type == 'url' && el.colKey != el.fieldName).map(res => { return res.fieldName });
        attDatacolKeys.push(...attDataHypColKeys);

        attDataLabels = attDatacols.filter(el => el.exportable == true).map(res => { return res.label });
        attDataLabels.push(...attDataHypColKeys);

        //Setting up the dataKeys for Detail & Attachment dynamic expression
        dataKeys = [];
        dataKeys.push(prDataColKeys);
        dataKeys.push(attDatacolKeys);

        //Setting up the headers for Detail & Attachment excel sheet
        xlsHeader = [];
        xlsHeader.push(prDataLabels);
        xlsHeader.push(attDataLabels);

        //Setting up the excel data for Detail & Attachment objects
        xlsData = [];
        xlsData.push(prData);
        xlsData.push(attData);


        //Creating empty array for importing the filtered data as per the columns 
        let createXLSLFormatObj = Array(xlsData.length).fill([]);
        /* form header list */
        xlsHeader.forEach((item, index) => createXLSLFormatObj[index] = [item])

        /* form data key list */
        xlsData.forEach((item, selectedRowIndex) => {
            let xlsRowKey = dataKeys[selectedRowIndex].filter(resp => Object.keys(item[0]).includes(resp));
            item.forEach((value, index) => {
                var innerRowData = [];
                xlsRowKey.forEach(item => {
                    innerRowData.push(value[item]);
                })
                createXLSLFormatObj[selectedRowIndex].push(innerRowData);
            })

        });
        // return data in excel seperate sheet format
        return createXLSLFormatObj;
    },

    //constraint a value to a range in excel, if exceeded
    clampRange: function (range) {
        if (range.e.r >= (1 << 20)) range.e.r = (1 << 20) - 1;
        if (range.e.c >= (1 << 14)) range.e.c = (1 << 14) - 1;
        return range;
    },

    //It will reet the ui filter value & error container to default
    resetFilters: function(component, event) {

        //resetting the error container
        component.set("v.showErrors", false);
        //resetting the custom search filters
        component.set("v.recordsFiltered", false);
        component.set('v.searchName','');
        component.set('v.searchVendor','');
        component.set('v.searchBrand','');
        component.set('v.searchGLDesc','');
        component.set('v.searchStatus','');
        component.set('v.searchGLCode','');    
    },
})