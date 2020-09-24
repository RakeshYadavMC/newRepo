({
    //This method opens the modal and sets the attribute "inModal" to true
    openModal: function(component, event, helper) {
        this.showPopupHelper(component, 'modalprompt', 'slds-slide-up-');
        this.showPopupHelper(component, 'backdrop', 'slds-backdrop_');
        component.set('v.inModal', true);
    },    
    closeModal: function(component, event, helper) {
        console.log('closing modal');
        component.get('v.modalPromise').then(
            function(modal) {
                modal.close();
            }
        );
    },
    //A helper method that removes a "hide" class and adds an "open" class
    showPopupHelper: function(component, componentId, className) {
        var modal = component.find(componentId);
        $A.util.removeClass(modal, className + 'hide');
        $A.util.addClass(modal, className + 'open');
    },
    
    //A helper method that removes an "open" class and adds a "hide" class
    hidePopupHelper: function(component, componentId, className) {
        var modal = component.find(componentId);
        $A.util.addClass(modal, className + 'hide');
        $A.util.removeClass(modal, className + 'open');
    },
    clearInput: function(component, event, helper) {
        component.set('v.selectedRecord', null);
        component.set('v.recordSelected', false);
        component.set('v.accountId', null);
        component.set("v.listOfSearchRecords", []);
        component.set("v.selectedSAPCompanyCode", {});
        component.set("v.sapCompanyCodeId",null);
        component.set("v.inputDisabled", true);
    },
    showSpinner: function (component, event, helper) {
        var spinner = component.find("custom_lookup_spinner");
        component.set("v.showSpinner2",true);
        $A.util.addClass(spinner, "slds-show");
        $A.util.removeClass(spinner, "slds-hide");
    },
    hideSpinner: function (component, event, helper) {
        var spinner = component.find("custom_lookup_spinner");
        component.set("v.showSpinner2",false);
        $A.util.addClass(spinner, "slds-hide");
        $A.util.removeClass(spinner, "slds-show");
    },
    searchHelper: function (component, event, helper) {
        // call the apex class method
        console.log('Search Helper Called:::');
        var action = component.get("c.getSAPCompanyForVendorAccount");
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
                helper.hideSpinner(component, event, helper);
                console.log('Records from apex ', storeResponse);
            }
            
        });
        // enqueue the Action
        $A.enqueueAction(action);
    },
    
})