({
    init: function (component, event, helper) {
        var openModal = component.get('v.autoOpenModal');
        component.set('v.showSpinner',false);
        if (openModal) {
            helper.openModal(component, event, helper);
        }
        
        var action = component.get("c.getAccountAndSAPCompanyCodeDetails");
        action.setParams({
            "PRHederId": component.get('v.PrHeaderRecordId')
        });
        
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                console.log("Store Response:::",storeResponse);
                component.set("v.selectedRecord",storeResponse['Account']);
                component.set("v.accountId",storeResponse['Account'].Id);
                component.set("v.selectedSapCompanyCodeLookUpRecord",storeResponse['SapCompanyCode']);
                component.set("v.sapCompanyCodeId",storeResponse['SapCompanyCode'].Id);
                if(component.get("v.sapCompanyCodeId")!= '' || component.get("v.sapCompanyCodeId") != undefined || component.get("v.sapCompanyCodeId") != null){
                    component.set("v.inputDisabled", false); 
                }
                console.log("Store Response Account:::",storeResponse['Account']);
            }
            
        });
        $A.enqueueAction(action);
    },
    
    onfocus: function (component, event, helper) {
        helper.showSpinner(component, event, helper);
        //var forOpen = component.find("searchRes");
        //$A.util.addClass(forOpen, 'slds-is-open');
        //$A.util.removeClass(forOpen, 'slds-is-close');
        // Get Default 5 Records order by createdDate DESC
        //var getInputkeyWord = '';
        console.log('On Focus:::');
        helper.searchHelper(component, event, helper);
    },
    
    keyPressController: function (component, event, helper) {
        console.log('Key Pressed:::');
        helper.showSpinner(component, event, helper);
        helper.searchHelper(component, event, helper);
        helper.hideSpinner(component, event, helper);
    },
    
    openModal: function (component, event, helper) {
        console.log('opening modal');
        helper.openModal(component, event, helper);
    },
    closeModal: function (component, event, helper) {
        helper.closeModal(component, event, helper);
    },
    handleCancel : function(component, event, helper) {
        component.find("accountSearchModal").notifyClose();
    },
    clearInput: function (component, event, helper) {
        helper.clearInput(component, event, helper);
    },
    
    // function for clear the Record Selaction
    clear: function (component, event, helper) {       
        console.log('clearing values');
        component.set("v.listOfSearchRecords", []);
        component.set("v.selectedSAPCompanyCode", {});
        component.set("v.sapCompanyCodeId",null);
    },
    
    handleShowModal: function (component, event, helper) {
        console.log('creating modal:::');
        component.set('v.showSpinner',true);
        setTimeout(function() {                                
            component.set('v.showSpinner',false);
        },1000)
        var modalBody;
        var modalFooter;
        $A.createComponents([ ["c:CloseModalFooter",{}], ["c:PRAccountSearchCmp", {
            "selectedRecord": component.getReference('v.selectedRecord'),
            "selectedRecordId": component.getReference('v.accountId')
        }] ],
                            function (content, status) {
                                if (status === "SUCCESS") {
                                    modalBody = content[1];
                                    modalFooter = content[0];
                                    console.log("Inside Modal:::");
                                    var modalPromise = component.find('overlayLib').showCustomModal({
                                        header: modalFooter,
                                        body: modalBody,
                                        showCloseButton: true,
                                        cssClass: "slds-modal_large modal_background mymodal",
                                        closeCallback: function () {
                                        }
                                    });
                                    console.log('modalPromise is::',modalPromise);
                                    component.set('v.modalPromise', modalPromise);
                                }
                            });
        
        
    },
    parentComponentEvent : function(component,event,helper) {
        var accountId = event.getParam("AccountId");
        console.log('Event Details:::',accountId);
        component.set("v.accountId", accountId);
        component.set("v.inputDisabled", false);
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
                "header": "Inactive Vendor",
                "message": "You have selected an inactive vendor for this company code. Please contact Master Data at GBS_GMDM_Customer&Vendor@beamsuntory.com to activate this vendor. You will not be able to submit a PR for an inactive vendor.",
                closeCallback: function() {                    
                }
            });*/
            component.set("v.showInactiveSAPMessage", true);
        }
        helper.hideSpinner(component, event, helper);
    },
    
    closeErrorModal: function(component, event, helper) {
        component.set("v.showError", false);
    },
    
    closeSAPInactiveModal: function(component, event, helper) {
        component.set("v.showInactiveSAPMessage", false);
    },
    
    moveToNextScreen: function(component, event, helper){
        var accountId = component.get("v.accountId");
        var sapCompanyCodeId = component.get("v.sapCompanyCodeId");
        console.log('accountId:::',accountId);
        console.log('sapCompanyCodeId:::',sapCompanyCodeId);
        if(accountId == undefined || sapCompanyCodeId == undefined){
            component.set("v.showError", true);
        }
        else{
            var navigate = component.get("v.navigateFlow");
            navigate(event.getParam("action"));
        }
    }
    
})