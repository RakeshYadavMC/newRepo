({
    doInit: function(component, event, helper) {
        
    },
    
    handleSuccess : function(component, event, helper) {
		var BarrelRecord = event.getParams().response;
	},
    
    onSuccess : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "type":"Success",
            "message": "Barrel & Sample records created successfully!! "
        });
        toastEvent.fire();
        
        var params = event.getParams().response;
        var recordid = params.id;
        var evt = $A.get("e.c:PassBarrelId");
        evt.setParams({ "eventBarrelId": recordid});
        evt.fire();
        console.log("record ID is : " + params.id);
        component.find("overlayLib").notifyClose();
        
        $A.get('e.force:refreshView').fire();
        location.reload();
    },
    onSubmit : function(component, event, helper) {
    },
    handleCreateLoad: function (component, event, helper) {
        var sampleKitIdval = component.get("v.sampleKitId");
    },
    onError : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Error!",
            "message": "Error."
        });
        toastEvent.fire();
        
    },
    CloseModel: function(component, event, helper){
        component.find("overlayLib").notifyClose();
    },
})