({
	doInit : function(component,event,helper){
        var recordId = component.get("v.recordId");
        helper.getBrandCountryRegionStateAllocations(component,event,helper);
    },
    closeQuickAction: function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
    submitDetails: function(component, event, helper) {
        helper.updateBrandCountryRegionStateAllocation(component,event,helper);
    },
    showSpinner: function(component, event, helper) {
        component.set("v.Spinner", true); 
    },
    hideSpinner : function(component,event,helper){
       component.set("v.Spinner", false);
    }
})