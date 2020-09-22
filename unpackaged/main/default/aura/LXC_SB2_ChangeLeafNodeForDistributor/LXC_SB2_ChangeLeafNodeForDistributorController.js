({
	doInit : function(component,event,helper){
        helper.getDistributorAllocations(component,event,helper);
    },
    closeQuickAction: function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
    submitDetails: function(component, event, helper) {
        helper.updateDistributorAllocations(component,event,helper);
    },
    showSpinner: function(component, event, helper) {
        component.set("v.isSpinner", true); 
    },
    hideSpinner : function(component,event,helper){
       component.set("v.isSpinner", false);
    }
})