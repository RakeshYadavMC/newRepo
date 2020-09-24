({
    doInit : function(component, event, helper) { 
        var controllingFieldAPI = component.get("v.controllingFieldAPI");
        var dependingFieldAPI = component.get("v.dependingFieldAPI");
        var objDetails = component.get("v.objDetail");
        helper.fetchPicklistValues(component,objDetails,controllingFieldAPI, dependingFieldAPI);
    },
    
    onControllerFieldChange: function(component, event, helper) {     
        var controllerValueKey = event.getSource().get("v.value"); // get selected controller field value
        var depnedentFieldMap = component.get("v.depnedentFieldMap");
        
        if (controllerValueKey != '--- None ---') {
            var ListOfDependentFields = depnedentFieldMap[controllerValueKey];
            
            if(ListOfDependentFields.length > 0){
                component.set("v.bDisabledDependentFld" , false);  
                helper.fetchDepValues(component, ListOfDependentFields);    
            }else{
                component.set("v.bDisabledDependentFld" , true); 
                component.set("v.listDependingValues", ['--- None ---']);
            }  
            
        } else {
            component.set("v.listDependingValues", ['--- None ---']);
            component.set("v.bDisabledDependentFld" , true);
        }
    },
    sendRequest: function(component, event, helper) {  
        let controllingFieldAPI = component.get("v.controllingFieldAPI");
        let controllingValue = component.get("v.controllingValue");
        let dependentFieldAPI = component.get("v.dependingFieldAPI");
        let dependentFieldValue = component.get("v.dependentValue");
        let setEvent = component.getEvent("sendFieldValue");
        setEvent.setParam("context", controllingFieldAPI + ',' + controllingValue+'-'+dependentFieldAPI+','+dependentFieldValue);
        setEvent.fire();
    }
})