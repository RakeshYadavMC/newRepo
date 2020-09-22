({
    changeCaseOwner : function(component, event, helper) {
        //get case record
        var caseObject = component.get("v.caseObj");
        //get current user id
        caseObject.OwnerId = $A.get("$SObjectType.CurrentUser.Id");
        
        var action = component.get("c.updateStatus");
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
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        //show loading spinner
        helper.toggleLoader(component, true);
        // enqueue the action
        $A.enqueueAction(action);
    }
})