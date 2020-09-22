({
    doInit: function(component, event, helper) {
        var CaseIdVal=component.get("v.CaseId");
    },
    handleSuccess : function(component, event, helper) {
        component.find('notifLib').showToast({
            "variant": "success",
            "title": "Account Created",
            "message": "Record ID: " + event.getParam("id")
        });
    },
    onSuccess : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "type":"Success",
            "message": "Sample Kit record has been created successfully."
        });
        toastEvent.fire();
        component.find("overlayLib").notifyClose();
        $A.get('e.force:refreshView').fire();
    },
    onSubmit : function(component, event, helper) {
    },
    handleCreateLoad: function (component, event, helper) {
        var sampleKitIdval = component.get("v.sampleKitId");
         var CaseIdVal=component.get("v.CaseId");
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        //alert('hello===');
        //alert(component.get("v.sampleKitId.Case__c"));
        //if(sampleKitIdval!='undefined'){
           
            var nameFieldValue = component.find("casaid").set("v.value",CaseIdVal);
            var ordergrp = component.find("orderid").set("v.value",component.get("v.BarrelOrderGrpId"));
            var submitter = component.find("submitterId").set("v.value",userId);
       // }
        //else{
            //component.find("casaid").set("v.value",component.get("v.sampleKitId.Case__c"));
                    //component.find("orderid").set("v.value",component.get("v.sampleKitId.Barrel_Order_Group__c"));

			//component.find("orderid").set("v.value",component.get("v.sampleKitId.Barrel_Order_Group__c")); 
           // component.find("KitName").set("v.value",component.get("v.sampleKitId.Name"));   
            /*component.find("trackingnumber").set("v.value",sampleKitIdval.Tracking_Number__c); 
            component.find("submitterId").set("v.value",sampleKitIdval.Submitter__c); 
            component.find("KitDeliveryDate").set("v.value",sampleKitIdval.Tracking_Number_Creation_Date__c); 
            component.find("trackingURL").set("v.value",sampleKitIdval.Tracking_URL__c); 
            component.find("deliveryStatus").set("v.value",component.get("v.sampleKitIdval.Delivery_Status__c")); 
            component.find("carrierId").set("v.value",sampleKitIdval.Carrier__c); 
            component.find("sampleselectedId").set("v.value",sampleKitIdval.Sample_Selected__c); 
            */
        //}
    },
    onError : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Error!",
            "message": "Error."
        });
        toastEvent.fire();
        //component.find("overlayLib").notifyClose();
        
    },
    CloseModel: function(component, event, helper){
        //alert('hello');
        component.find("overlayLib").notifyClose();
    },
    
    
    
})