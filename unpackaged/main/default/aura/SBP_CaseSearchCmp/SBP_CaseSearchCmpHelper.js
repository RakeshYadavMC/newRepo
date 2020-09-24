({
    createTable : function(component, event, helper){
        component.set('v.columns', [
            {label: 'No.', fieldName: 'serialNumber', initialWidth: 60, type: 'number'},
            {label: 'Case Number', fieldName: 'CaseNum', initialWidth: 80, type: 'url',typeAttributes: {label: { fieldName: 'CaseNumber' }, target: '_self', tooltip:""}},
            {label: 'Retail Account', fieldName: 'RetailAccountName', initialWidth: 80, type: 'text'},
            {label: 'Brand', fieldName: 'Brand__c',initialWidth: 80, type: 'text'},
            {label: 'Status', fieldName: 'Status',initialWidth: 80, type: 'text'},
            {label: 'Type', fieldName: 'Type',initialWidth: 80, type: 'text'},
            {label: 'Date/Time Opened', fieldName: 'CreatedDate',initialWidth: 80, type: 'date',typeAttributes: {day:'numeric',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',hour12: true}},
            {label: 'Submitter', fieldName: 'Submitter',initialWidth: 80, type: 'text'},                       
            {label: 'Purchase Order Number', fieldName: 'Purchase_Order_Number__c',initialWidth: 80, type: 'text'},
            {label: 'Purchase Order Uploaded', fieldName: 'Purchase_Order_Uploaded__c',initialWidth: 80, type: 'text',cellAttributes: {iconName: { fieldName: 'purchaseOrderIcon'}}},
            {label: 'POS Items Selected', fieldName: 'POS_Items_Selected__c',initialWidth: 80, type: 'text',cellAttributes: {iconName: { fieldName: 'posItemSelectedIcon'}}},
            {label: 'Bottle Text Entered', fieldName: 'Bottle_Text_Entered__c',initialWidth: 80, type: 'text',cellAttributes: {iconName: { fieldName: 'bottleTextSelectedIcon'}}},
            {label: 'Barrel Selected', fieldName: 'Barrel_Selected__c',initialWidth: 80, type: 'text',cellAttributes: {iconName: { fieldName: 'barrelSelectedIcon' }}},
            {label: 'Barrel Selected Date', fieldName: 'Barrel_Selected_Date__c',initialWidth: 80, type: 'date',typeAttributes: { day:'numeric', month:'2-digit',year:'numeric'}},
            {label: 'Distributor Account', fieldName: 'AccountName',initialWidth: 80, type: 'text'}
        ]); 
    },   
    getObjectRecords : function(component, event, helper) {        
        component.set("v.currentPage", 1);
        component.set("v.totalPagesCount", 1);
        component.set("v.totalRecordsCount",0);
        component.set("v.paginationList",[]);
        component.set("v.startPage",0);
        component.set("v.endPage",0);        
        var action = component.get("c.fetchCaseRecords");
        var selectedBrand = component.get('v.brandFilter');
        console.log('Search Query:::',component.get('v.searchQuery'));
        console.log('Toggle Value:::',component.get("v.toggleCompleteIncomplete"));
        if(selectedBrand == 'All Brands' || selectedBrand == '' || selectedBrand == undefined){
            action.setParams({
                "strQuery": component.get('v.searchQuery'),
                "toggle" : component.get("v.toggleCompleteIncomplete")
            });      
        }
        else{
            action.setParams({
                "strQuery": component.get('v.searchQuery'),
                "brand" : selectedBrand,
                "toggle" : component.get("v.toggleCompleteIncomplete")
            });
        }       
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var serverResponse = response.getReturnValue();
                
                
                for (var i = 0; i < serverResponse.length; i++) {
                    var row = serverResponse[i];
                    row.serialNumber = i+1;
                    if (row.Account) row.AccountName = row.Account.Name;
                    if (row.Retail_Account__r) row.RetailAccountName = row.Retail_Account__r.Name;
                    if (row.Submitter__r) row.Submitter = row.Submitter__r.Name;
                    if (row.CaseNumber) row.CaseNum = '/customer/s/case/'+row.Id;
                    if(row.Purchase_Order_Uploaded__c){
                        row.purchaseOrderIcon = "action:approval";
                    }
                    else{
                        row.purchaseOrderIcon = "action:close";
                    }
                    if(row.POS_Items_Selected__c){
                        row.posItemSelectedIcon = "action:approval";
                    }
                    else{
                        row.posItemSelectedIcon = "action:close";
                    }
                    if(row.Bottle_Text_Entered__c){
                        row.bottleTextSelectedIcon = "action:approval";
                    }
                    else{
                        row.bottleTextSelectedIcon = "action:close";
                    }
                    if(row.Barrel_Selected__c){
                        row.barrelSelectedIcon = "action:approval";
                    }
                    else{
                        row.barrelSelectedIcon = "action:close";
                    }
                }
                component.set("v.totalRecordList",serverResponse);
                if(serverResponse.length == 0){
                    helper.showToast('No records found', '', 'info');
                    return;
                }
                else if(serverResponse.length > 0){
                    var pageSize = component.get("v.noOfRecordsPerPage");
                    var totalRecordList = serverResponse;
                    var totalLength = totalRecordList.length;
                    component.set("v.totalRecordsCount",totalLength);
                    component.set("v.startPage",0);
                    component.set("v.endPage",pageSize-1);
                    var paginationList = [];
                    for(var i=0; i<pageSize; i++){
                        if(component.get("v.totalRecordList").length > i){
                            paginationList.push(serverResponse[i]);
                        }
                    }
                    
                    component.set("v.paginationList",paginationList);
                    component.set("v.totalPagesCount", Math.ceil(totalLength / pageSize));
                }                               
            } else{
                console.log("Error Occured:::");
            }                        
        });
        $A.enqueueAction(action);
    },
    next : function(component, event, helper, sObjectList, end, start, pageSize){
        var Paginationlist = [];
        var counter = 0;
        for(var i = end + 1; i < end + pageSize + 1; i++){
            if(sObjectList.length > i){ 
                Paginationlist.push(sObjectList[i]);
            }
            counter ++ ;
        }
        start = start + counter;
        end = end + counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.paginationList', Paginationlist);
    },
    // navigate to previous pagination record set   
    previous : function(component, event, helper, sObjectList, end, start, pageSize){
        var Paginationlist = [];
        var counter = 0;
        for(var i= start-pageSize; i < start ; i++){
            if(i > -1){
                Paginationlist.push(sObjectList[i]);
                counter ++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.paginationList', Paginationlist);
    }, 
    showToast: function(message, title, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "message": message,
            "type": type,
            "mode": "dismissible"
        });
        toastEvent.fire();
    },
})