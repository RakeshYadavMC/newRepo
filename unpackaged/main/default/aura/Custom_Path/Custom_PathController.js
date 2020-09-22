({
    handleSelect : function (component, event, helper) {
     var stepName = event.getParam("detail").value;
     var toastEvent = $A.get("e.force:showToast");
     toastEvent.setParams({
       //"title": "Success!",
         "message": stepName+" Status Selected, Click Mark Status As Complete"
        });
        toastEvent.fire();
    }
})