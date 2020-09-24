({
    sendSurveyEmail : function(component, event, helper) {
        //get case record
        var caseObject = component.get("v.caseObj");
        
        var action = component.get("c.sendEmail");
        action.setParams({
            obj: caseObject,
            recId : component.get("v.recordId")  
        });
        // set call back 
        action.setCallback(this, function(response) {
            
            var state = response.getState();
            if (state === "SUCCESS") {
                //hide loading spinner
                helper.toggleLoader(component, false);
                helper.disableSendLinkButton(component, true);
                $A.get('e.force:refreshView').fire();
            }
            else if (state === "INCOMPLETE") {
                //hide loading spinner
                helper.toggleLoader(component, false);
            } else if (state === "ERROR") {
                //hide loading spinner
                helper.toggleLoader(component, false);
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        //console.log("Error message: " + errors[0].message);
                    }
                }
            }
        });
        //show loading spinner
        helper.toggleLoader(component, true);
        // enqueue the action
        $A.enqueueAction(action);
    },
    
    //method to be called when record is loaded
    handleRecordUpdated: function(component, event, helper){
        var eventParams = event.getParams();
        if(eventParams.changeType === 'LOADED') {
            helper.disableSendLinkButton(component, component.get("v.caseObj.Send_Survey_Link__c"));
        }
    }
})