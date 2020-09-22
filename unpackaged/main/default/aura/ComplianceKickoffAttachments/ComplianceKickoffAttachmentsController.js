({
	attachmentHandler : function(component, event, helper) {
        //alert(component.get("v.recordId"));
		var action = component.get("c.UpdateAttachments");
        action.setParams({
            CaseId: component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            //alert(response.getError());
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "type":"success",
                    "message": "Attachments are successfully updated on Sub Cases."
                });
                toastEvent.fire();
                //component.set("v.acctList", response.getReturnValue());
            } else {
                 var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "type":"error",
                    "message": "Something went wrong, Please try after sometime."
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
	}
})