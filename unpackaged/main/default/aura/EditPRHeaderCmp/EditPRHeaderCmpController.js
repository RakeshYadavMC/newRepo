({
    init : function(component,event,helper){
        component.set("v.showSpinner",true);
        var action = component.get("c.getAccountAndSAPCompanyCodeDetails");
        action.setParams({
            "PRHederId": component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                console.log("Store Response:::",storeResponse);
                component.set("v.selectedRecord",storeResponse['Account']);
                component.set("v.accountId",storeResponse['Account'].Id);
                component.set("v.selectedSAPCompanyCode",storeResponse['SapCompanyCode']);
                component.set("v.sapCompanyCodeId",storeResponse['SapCompanyCode'].Id);
                /*if(component.get("v.sapCompanyCodeId")!= '' || component.get("v.sapCompanyCodeId") != undefined || component.get("v.sapCompanyCodeId") != null){
                   component.set("v.inputDisabled", false); 
                }*/
                console.log("Store Response Account:::",storeResponse['Account']);
                console.log('Selected Account:::',component.get("v.selectedRecord"));
                console.log('SAP Company Code:::',component.get("v.selectedSAPCompanyCode"));
                console.log('SAP Company Code Id:::',component.get("v.selectedSAPCompanyCode").Id);
            }
                
            });
        $A.enqueueAction(action);
        setTimeout(function() {
            component.set("v.showSpinner", false);
        }, 3000);
    },
    
    showSpinner: function(component, event, helper) {
        // make Spinner attribute true for displaying loading spinner 
        component.set("v.spinner", true); 
    },
    
    hideSpinner : function(component,event,helper){
        // make Spinner attribute to false for hiding loading spinner    
        component.set("v.spinner", false);
    },
    
    saveMethod : function(component, event, helper){
        var invalidFields = helper.isFormValid(component, event, helper);
        if (!invalidFields) {
            console.log('Invalid Input:::');
            component.set("v.showError", true);
            return;
        }
        helper.updatePRHeaderRecord(component, event, helper);
    },
    
    cancelMethod : function(component, event, helper){
        console.log('Cancel Clicked:::');
        helper.redirectMethod(component, event, helper);
    },
    
    openModel: function(component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpen", true);
    },
    
    closeModel: function(component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpen", false);
    },
    
    clearInput: function (component, event, helper) {
        helper.clearInput(component, event, helper);
    },    
    
    closeErrorModal: function(component, event, helper) {
        component.set("v.showError", false);
    },
    
    closeSAPInactiveModal: function(component, event, helper) {
        component.set("v.showInactiveSAPMessage", false);
    },
    
    handleShowModal: function (component, event, helper) {
        component.set("v.isOpen",true);
    },
    
    onfocus: function (component, event, helper) {
        helper.showSpinnerHelper(component, event, helper);
        console.log('On Focus:::');
        helper.searchHelper(component, event, helper);
    },
    
    keyPressController: function (component, event, helper) {
        console.log('Key Pressed:::');
        helper.showSpinnerHelper(component, event, helper);
        helper.searchHelper(component, event, helper);
        helper.hideSpinnerHelper(component, event, helper);
    },
    
    parentComponentEvent : function(component,event,helper) {
        var accountRecord = event.getParam("AccountRecord");
        component.set("v.selectedRecord",accountRecord);
        component.set("v.accountId",accountRecord.Id);
        component.set("v.isOpen", false);
        component.set("v.inputDisabled", false);
    },
    
    // function for clear the Record Selaction
    clearSapFields: function (component, event, helper) {       
        console.log('clearing values');
        component.set("v.listOfSearchRecords", []);
        component.set("v.selectedSAPCompanyCode", {});
        component.set("v.sapCompanyCodeId",null);
    },
    
    handleComponentEvent: function (component, event, helper) {
        // get the selected SAP Company Code record from the COMPONENT event
        console.log('Handle Event Fired:::');
        var selectedSAPCompanyCodeFromEvent = event.getParam("recordByEvent");
        component.set("v.selectedSAPCompanyCode", selectedSAPCompanyCodeFromEvent);
        component.set("v.sapCompanyCodeId", selectedSAPCompanyCodeFromEvent.Id);
        var sapCompanyCodeStatus = selectedSAPCompanyCodeFromEvent.Status__c;
        console.log("SAP Code Status", sapCompanyCodeStatus);
        if(sapCompanyCodeStatus=='Inactive'){
            /*component.find('notifLib').showNotice({
                "variant": "warning",
                "header": "Please Note",
                "message": "You have selected an inactive company code. Please work with GMDM to update the status of this vendor for the company code. You will not be able to submit a PR for inactive company codes!",
                closeCallback: function() {                    
                }
            });*/  
           component.set("v.showInactiveSAPMessage", true); 
        }
        helper.hideSpinnerHelper(component, event, helper);
    },
    
})