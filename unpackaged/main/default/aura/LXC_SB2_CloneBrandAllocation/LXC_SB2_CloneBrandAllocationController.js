({
    doInit : function(component,event,helper){
        var recordId = component.get("v.recordId");
        var brandAllocation = "{'Id':'','Brand__c':'','Name':'',,'Is_Active__c':'','Is_Carry_Forward__c':'','Program_Type__c':'','Time_Period__c':'','Year_Of_Allocation__c':''}";
        helper.fetchTypePicklist(component);
        component.set("v.newBrandAllocation",brandAllocation);
        helper.getBrandAllocations(component,event,helper);
        var controllingFieldAPI = component.get("v.controllingFieldAPI");
        var dependingFieldAPI = component.get("v.dependingFieldAPI");
        var objDetails = component.get("v.objDetail");
        helper.fetchPicklistValues(component,objDetails,controllingFieldAPI, dependingFieldAPI);
    },
    
    closeQuickAction: function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
        
    },
    onControllerFieldChange: function(component, event, helper) {     
        var controllerValueKey = event.getSource().get("v.value");
        var dependentFieldMap = component.get("v.dependentFieldMap");
        
        if (controllerValueKey != '--- None ---') {
            var ListOfDependentFields = dependentFieldMap[controllerValueKey];
            
            if(ListOfDependentFields.length > 0){
                component.set("v.isDependentField" , false);  
                helper.fetchDepValues(component, ListOfDependentFields);    
            }else{
                component.set("v.isDependentField" , true); 
                component.set("v.listDependingValues", ['--- None ---']);
            }  
            
        } else {
            component.set("v.listDependingValues", ['--- None ---']);
            component.set("v.isDependentField" , true);
        }
    },
    
    saveBrandAllocation : function(component, event, helper) {
        let inputSelect = component.find("fieldId");
        let allValid = true;
        if(inputSelect) {
            inputSelect.forEach(function(fieldComponent){
                if(fieldComponent) {
                    fieldComponent.focus();
                    if(fieldComponent.get('v.value') == '' || fieldComponent.get('v.value') == '--- None ---')
                    {
                        fieldComponent.showHelpMessageIfInvalid();
                        allValid = false;
                    }
                }
            });
        }
        if(allValid == false) {
            component.set("v.error","Please fill all required fields");
        }
        if(allValid ==  true) {
            helper.cloneNewBrandAllocation(component, event, helper);
        }
    },
    showSpinner: function(component, event, helper) {
        component.set("v.Spinner", true); 
    },
    

    hideSpinner : function(component,event,helper){
        component.set("v.Spinner", false);
    }
    
})