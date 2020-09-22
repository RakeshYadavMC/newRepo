({
        loadOptions: function (cmp, evt, helper) {
        var workspaceAPI = cmp.find('workspace');
        workspaceAPI
            .getFocusedTabInfo()
            .then(function (response) {
                //To handle creating record from related lists
                if (
                    (response.hasOwnProperty('isSubtab') && response['isSubtab']) ||
                    (response.hasOwnProperty('subtabs') && response['subtabs'].length > 0)
                ) {
                    let brandId = response['recordId']
                        ? response['recordId']
                        : response.pageReference.state.ws.split('/')[4];
                    cmp.set('v.brandId', brandId);
                    cmp.set('v.newBrandAllocation.Brand__c',brandId);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    handleComponentEvent : function(component, event, helper) {
        var result = event.getParam("context");
        if(result.includes('-')){
            let allvalue = result.split('-');
            for(var i=0;i<result.split('-').length;i++){
                var fieldName = allvalue[i].split(',')[0];
                var fieldValue = allvalue[i].split(',')[1];
                component.set('v.newBrandAllocation.'+fieldName, fieldValue);
                console.log(component.get('v.newBrandAllocation.'+fieldName));
            }
        } else{
            if((result != '' || result != null) && result.includes(',')){
                var fieldName = result.split(',')[0];
                var fieldValue = result.split(',')[1];
                component.set('v.newBrandAllocation.'+fieldName, fieldValue);
                console.log(component.get('v.newBrandAllocation.'+fieldName));
            }
        }
    },
    handleSubmit: function(component, event, helper) {
    	let inputSelect = component.find("fieldId");
        let allValid = true;
        if(inputSelect) {
            inputSelect.forEach(function(fieldComponent){
                if(fieldComponent) {
                    let selectField = fieldComponent.find("fieldId");
                    selectField.focus();
                    if(!selectField.get('v.validity').valid)
                    {
                        selectField.showHelpMessageIfInvalid();
                        allValid = false;
                    }
                }
            });
            let dynamicSelect = component.find("dynamicField");
            if(dynamicSelect){
                let selectField1 = dynamicSelect.find("dynamicField");
                if(selectField1){
                    selectField1.forEach(function(fieldComponent){
                        fieldComponent.focus();
                        if(!fieldComponent.get('v.validity').valid)
                        {
                            fieldComponent.showHelpMessageIfInvalid();
                            allValid = false;
                        }
                    });
                }
            }
        }
        if(allValid == false) {
            component.set("v.error","Please fill all required fields");
        }
        if(allValid ==  true) {
            helper.validateNewBrandAllocation(component, event, helper);
        }
    },
        showSpinner: function (component, event, helper) {
        // make Spinner attribute true for display loading spinner
        component.set('v.Spinner', true);
    },

    // this method automatic call by aura:doneWaiting event
    hideSpinner: function (component, event, helper) {
        // make Spinner attribute to false for hide loading spinner
        component.set('v.Spinner', false);
    },
    handleCancel: function (cmp, evt, helper) {
        helper.closeTab(cmp);
    },
    handleCloseModal: function(component, event, helper) {
        //For Close Modal, Set the "openModal" attribute to "fasle"  
        component.set("v.openModal", false);
    },
    handleOkModal:function(component, event, helper){
        component.set("v.openModal", false);
        helper.updatePreviousAllocation(component, event, helper);
    },
    handleContinueModal:function(component, event, helper){
        component.set("v.openModal", false);
        helper.createBrandAllocation(component, event, helper);
    }
})