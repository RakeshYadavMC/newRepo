({
    getSampleKit : function(component, event, helper) {
        var action = component.get("c.getRelatedSampleKit");
        action.setParams({
            "caseId": component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var requestObject = response.getReturnValue();
                //console.log('Sample Kit Id:::',requestObject.responseMap.sampleKitId);
                component.set('v.sampleKitId',requestObject.responseMap.sampleKitId);
                component.set('v.recordIdLoaded',true);
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.log('Error occured:::',errors[0].message);
            }
            component.set('v.showSpinner',false);
        });
        $A.enqueueAction(action);
    }
})