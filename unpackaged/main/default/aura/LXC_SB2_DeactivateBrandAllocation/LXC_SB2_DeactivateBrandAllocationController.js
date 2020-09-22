({
    doInit : function(component,event,helper){
        var recordId = component.get("v.recordId");
        helper.getBrandAllocations(component,event,helper);
    },
    
    submitDetails: function(component, event, helper) {
        helper.updateBrandAllocation(component,event,helper);		
    },
    closeQuickAction: function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
        
    },
    showSpinner: function(component, event, helper) {
        component.set("v.isSpinner", true); 
    },
    
    hideSpinner : function(component,event,helper){
        component.set("v.isSpinner", false);
    },
    deactivateAll : function(component, event, helper) {
        helper.deactivateAllBrandAllocation(component,event,helper);	
    }
})