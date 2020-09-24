({
	doInit : function(component, event, helper) {
		helper.fetchPaymentTermsPicklist(component, event, helper);
        helper.fetchPRCurrencyPicklist(component, event, helper);
	},
    showSpinner: function(component, event, helper) {
        component.set("v.spinnerFlag", true); 
    },     
    hideSpinner : function(component,event,helper){
        component.set("v.spinnerFlag", false);
    },
    moveToNextScreen: function(component, event, helper){
       var navigate = component.get("v.navigateFlow");
       navigate(event.getParam("action")); 
    }
})