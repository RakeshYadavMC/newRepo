({
    redirectMethod : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var context = component.get("v.environmentContext");
        if(context != undefined) {
            if(context == 'Theme4t' || context == 'Theme4d') {
                console.log('VF in S1 or LEX');
                sforce.one.navigateToSObject(recordId);
            } else {
                console.log('VF in Classic'); 
                window.location.assign('/'+recordId);
            }
        } else {
            console.log('standalone Lightning Component');
            var event = $A.get("e.force:navigateToSObject");
            event.setParams({"recordId": recordId});
            event.fire();
        }
        //Below line added by Sripal for autorefreshing the PR details on 06/29/2020
        //$A.get('e.force:refreshView').fire();
    },
    
    isFormValid: function(component, event, helper) {   
        var accountId = component.get('v.accountId');
        var sapCompanyCodeId = component.get('v.sapCompanyCodeId');
        var paymentId = component.find('paymentId').get('v.value');                    	
        var prCurrencyId =(component.find('prCurrencyId')!= undefined)? component.find('prCurrencyId').get('v.value'): ' ';
        /*var status=component.get('v.simpleRecord.Status__c');
        alert(status);
        if(status=='Submitted'){
        	prCurrencyId=component.get('v.simpleRecord.PR_Currency__c');
        } */
        //var reqDateId = component.find('reqDateId').get('v.value');
        //var sapSupportId = component.find('sapSupportId').get('v.value');
        if ((accountId == null || accountId == '' || accountId == undefined) || 
            (sapCompanyCodeId == null || sapCompanyCodeId == '' || sapCompanyCodeId == undefined) ||
            (paymentId == null || paymentId == '' || paymentId == undefined) ||
            (prCurrencyId == null || prCurrencyId == '' || prCurrencyId == undefined))
        {
            //helper.showToast('Please fill out required fields', '', 'error');
            return false;
        }
        return true;
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
    
    clearInput: function(component, event, helper) {
        component.set('v.selectedRecord', null);
        component.set('v.accountId', null);
        component.set("v.listOfSearchRecords", []);
        component.set("v.selectedSAPCompanyCode", {});
        component.set("v.sapCompanyCodeId",null);
        component.set("v.inputDisabled", true);
    },
    
    searchHelper: function (component, event, helper) {
        // call the apex class method
        console.log('Search Helper Called:::');
        var action = component.get("c.getSAPCompanyForVendorAccount");
        console.log("Accunt id is::",component.get('v.accountId'));
        // set param to method
        action.setParams({
            'parentId': component.get('v.accountId')
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                console.log("Store Response:::",storeResponse);
                // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length == 0) {
                    component.set("v.Message", 'No Result Found...');
                } else {
                    component.set("v.Message", '');
                }
                // set searchResult list with return value from server.
                component.set("v.listOfSearchRecords", storeResponse);
                console.log('Method Output:::',component.get("v.listOfSearchRecords"));
                helper.hideSpinnerHelper(component, event, helper);
                console.log('Records from apex ', storeResponse);
            }
            
        });
        //Below line added by Sripal for autorefreshing the PR detail on 06/29/2020
        //$A.get('e.force:refreshView').fire();
        // enqueue the Action
        $A.enqueueAction(action);
    },
    showSpinnerHelper: function (component, event, helper) {
        var spinner = component.find("custom_lookup_spinner");
        component.set("v.showSpinner2",true);
        $A.util.addClass(spinner, "slds-show");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinnerHelper: function (component, event, helper) {
        var spinner = component.find("custom_lookup_spinner");
        component.set("v.showSpinner2",false);
        $A.util.addClass(spinner, "slds-hide");
        $A.util.removeClass(spinner, "slds-show");
    },
    updatePRHeaderRecord: function(component, event, helper) {
        var action = component.get("c.updatePRHeader");
        var prHeaders = helper.buildPRHeaderRecord(component, event, helper);
        console.log('JSON ', JSON.stringify(Object.values(prHeaders)));
        
        action.setParams({
            'jsonPRHeaders': JSON.stringify(Object.values(prHeaders))
        });
        
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var message = response.getReturnValue();
                console.log("Response From Apex:::",message);
                helper.redirectMethod(component, event, helper);
            }
            else {
                var message = response.getReturnValue();
                console.log("Response From Apex:::",message);
            }
            
        });
        $A.enqueueAction(action);
        //Below line added by Sripal on 06/29/2020 for autorefreshing the PR details 
        //$A.get('e.force:refreshView').fire();
    },
    buildPRHeaderRecord: function(component, event, helper) {
        var PRHeaders = [];
        var PRHeaderRecord = {};
        var accountLabel = component.get('v.posLabelAccountName');
        PRHeaderRecord['Id'] = component.get('v.recordId');
        PRHeaderRecord['Vendor_Name__c'] = component.get('v.accountId');
        PRHeaderRecord['SAP_Company_Code__c'] = component.get('v.sapCompanyCodeId');
        PRHeaderRecord['Payment_Terms__c'] = component.find('paymentId').get('v.value');        
        if(component.find('prCurrencyId')!= undefined){
        	PRHeaderRecord['PR_Currency__c'] = component.find('prCurrencyId').get('v.value');
        }
        if(component.find('FinanceNotes')!= undefined){
        	PRHeaderRecord['Finance_Notes__c'] = component.find('FinanceNotes').get('v.value');    
        }        
        //PRHeaderRecord['Request_Date__c'] = component.find('reqDateId').get('v.value');
        //PRHeaderRecord['SAP_Support__c'] = component.find('sapSupportId').get('v.value');
        console.log('PR Header ', PRHeaderRecord);        
        PRHeaders.push(PRHeaderRecord);        
        return PRHeaders;
    },
})