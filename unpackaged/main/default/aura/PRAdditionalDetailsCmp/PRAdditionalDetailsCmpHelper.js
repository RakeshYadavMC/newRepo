({
	fetchPaymentTermsPicklist : function(component, event, helper){
        var action = component.get("c.getPRPicklistvalues");
        action.setParams({
            'objectName': component.get("v.objectName"),
            'field_apiname': component.get("v.paymentTermsAPIName"),
            'nullRequired': false
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.paymentTermsPicklist", a.getReturnValue());
                component.set("v.paymentTerms", a.getReturnValue()[0]);
            } 
        });
        $A.enqueueAction(action);
    },
    
    fetchPRCurrencyPicklist : function(component, event, helper){
        var action = component.get("c.getPRPicklistvalues");
        action.setParams({
            'objectName': component.get("v.objectName"),
            'field_apiname': component.get("v.prCurrencyAPIName"),
            'nullRequired': false
        });
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS"){
                component.set("v.prCurrencyPicklist", a.getReturnValue());
                component.set("v.prCurrency", a.getReturnValue()[0]);
            } 
        });
        $A.enqueueAction(action);
    },
})