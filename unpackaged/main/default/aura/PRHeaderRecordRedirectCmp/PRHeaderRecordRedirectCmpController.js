({    
    init : function(component,event,helper){
        var recordId = component.get("v.recordId");
        var action = component.get("c.getDomainURL");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var retURL = response.getReturnValue();
                var url = retURL +'/' + recordId;
        		component.set("v.recordURL",url);
            }else{
                console.log("Error Occured:::");
            }     
        });
        $A.enqueueAction(action);
    },
    
    invoke : function(component, event, helper) {
        // Get the record ID attribute
        var record = component.get("v.recordId");
        
        // Get the Lightning event that opens a record in a new tab
        var redirect = $A.get("e.force:navigateToSObject");
        
        // Pass the record ID to the event
        redirect.setParams({
            "recordId": record
        });
        
        // Open the record
        redirect.fire();
    },

    
})