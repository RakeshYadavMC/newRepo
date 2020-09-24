({
    doInitialization : function (component, event, helper) {
        var parentId=component.get("v.recordId");
        var action=component.get('c.getAllSampleKits');
        var existingSamplekitList=[];
        var title="Sample Kits";
        action.setParams({
            CaseRecId : parentId
        });
        action.setCallback(this,function(response){     
            var state=response.getState();
            var responseLength=response.getReturnValue().length;

            if(state==="SUCCESS")
            {
                //added by mahesh
                var serverResponse = response.getReturnValue();

                for (var i = 0; i < serverResponse.length; i++) {
                    var row = serverResponse[i];
                    var sampleKitId = row.Id;
                    component.set("v.getSampleKitlId", sampleKitId);
                }
                
                if(responseLength <= 3)
                {
                    component.set("v.sampleKitNumber",title + ' ' + '(' + response.getReturnValue().length + ')');
                    component.set("v.existingSamplekitList",response.getReturnValue());
                   
                }
                else
                {
                    component.set("v.sampleKitNumber",title + ' ' + '(' + '3+' + ')');
                    
                    for(var i=0; i<3;i++)
                    {
                        existingSamplekitList.push(response.getReturnValue()[i]);
                        var sampleKitId = response.getReturnValue()[i].Id;
                        console.log('sampleKitId is::'+sampleKitId);
                    }
                    component.set("v.existingSamplekitList",existingSamplekitList);
                }
                
            }
            
        });
        $A.enqueueAction(action);
        var action2=component.get('c.getCaseDetails');
        action2.setParams({
            CaseRecId : parentId
        });
        action2.setCallback(this,function(res){     
            var state=res.getState();
            if(state==="SUCCESS"){
                component.set("v.CaseRec",res.getReturnValue())
                var brand = component.get("v.CaseRec").Brand__c;
                console.log('Brand is:::',brand);
                component.set("v.brand",brand);
            }
        });
        $A.enqueueAction(action2); 
        //Added by Mahesh
        var actionSample=component.get('c.getSampleDetails');
        actionSample.setParams({
            CaseRecId : parentId
        });
        actionSample.setCallback(this,function(res){     
            var state=res.getState();
            if(state==="SUCCESS"){
                component.set("v.sampleList",res.getReturnValue())
            }
        });
        $A.enqueueAction(actionSample);
        
        $A.get('e.force:refreshView').fire();
        
    },
    addSampleKit: function(component, evt, helper) {
        // alert(JSON.stringify(component.get("v.CaseRec")));
        //alert(component.get("v.CaseRec").Barrel_Order_Group__c);
        var barrelorderid = component.get("v.CaseRec").Barrel_Order_Group__c;
        //alert("Before creating Modal");
        var modalBody;
        $A.createComponent("c:SBP_SampleKitNewForm", {
            CaseId:component.get("v.recordId"),
            BarrelOrderGrpId : barrelorderid,
        },
                           function(instanceOfContactForm, status) {
                               if (status === "SUCCESS") {
                                   modalBody = instanceOfContactForm;
                                   component.find('overlayLib').showCustomModal({
                                       header: "New Sample Kit",
                                       body: modalBody, 
                                       showCloseButton: true,
                                       closeCallback: function(ovl) {
                                           console.log('Overlay is closing');
                                       }
                                   }).then(function(overlay){
                                       console.log("Overlay is made");
                                   });
                                   
                               }                             
                           });
        $A.get('e.force:refreshView').fire();
    },
    
    
    navigateToRelatedList: function(component,event,helper){
        var rlEvent = $A.get("e.force:navigateToRelatedList");
        rlEvent.setParams({
            "relatedListId": "Sample_Kits__r",
            "parentRecordId": component.get("v.recordId")
        });
        rlEvent.fire();
    },
    navigatetoRecord: function(component, event, helper){
        var objId = component.get("conid").value();
        //alert(objId);
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": objId,
            "slideDevName": "related"
        });
        navEvt.fire();
        
    },
    handleSelect: function(component, event, helper){
        var selectedMenu = event.detail.menuItem.get("v.label");
        //alert(selectedMenu);
        //console.log('selectedMenu-' + selectedMenu);
        switch(selectedMenu) {
            case "Edit":
                //do create
                var samplekitrecord = event.detail.menuItem.get("v.value");
                //alert(samplekitid);
                var barrelorderid = component.get("v.CaseRec").Barrel_Order_Group__c;
                var modalBody;
                $A.createComponent("c:SBP_SampleKitNewForm", {
                    CaseId:component.get("v.recordId"),
                    BarrelOrderGrpId : barrelorderid,
                    sampleKitId :samplekitrecord,
                },
                                   function(instanceOfContactForm, status) {
                                       if (status === "SUCCESS") {
                                           modalBody = instanceOfContactForm;
                                           component.find('overlayLib').showCustomModal({
                                               header: "New Sample Kit",
                                               body: modalBody, 
                                               showCloseButton: true,
                                               closeCallback: function(ovl) {
                                                   console.log('Overlay is closing');
                                               }
                                           }).then(function(overlay){
                                               console.log("Overlay is made");
                                           });
                                           
                                       }                             
                                   });
                
                $A.get('e.force:refreshView').fire();
                break;
            case "Delete":
                //do delete
                var action3=component.get('c.DeleteSampleKitRecord');
                var sampleDelId = event.detail.menuItem.get("v.value");
                
                action3.setParams({
                    samplekitdelId : sampleDelId
                });
                action3.setCallback(this,function(res){     
                    var state=res.getState();
                    //alert(state);
                    if(state==="SUCCESS"){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Success!",
                            "type":"Success",
                            "message": "Sample Kit record has been deleted successfully."
                        });
                        toastEvent.fire();
                        
                    }
                });
                $A.enqueueAction(action3);
                $A.get('e.force:refreshView').fire();
                location.reload();
                break;
            //Added by Mahesh    
            case "Create New Sample":
                var samplekitrecord = event.detail.menuItem.get("v.value");
                var modalBody;
                
                $A.createComponent("c:SBP_BarrelNewForm", {
                    brand:component.get("v.brand"),
                },
                                   function(instanceOfContactForm, status) {
                                       if (status === "SUCCESS") {
                                           modalBody = instanceOfContactForm;
                                           component.find('overlayLib').showCustomModal({
                                               header: "New Barrel",
                                               body: modalBody, 
                                               showCloseButton: true,
                                               closeCallback: function(ovl) {
                                                   console.log('Overlay is closing');
                                               }
                                           }).then(function(overlay){
                                               console.log("Overlay is made");
                                           });
                                           
                                       }                             
                                   });
        
                
                $A.get('e.force:refreshView').fire();
                break;
        }
        
        $A.get('e.force:refreshView').fire();
        
    },
   
    //Added by mahesh
    getValueFromApplicationEvent: function(component, event, helper){
        
        var ShowResultValue = event.getParam("eventBarrelId");
        console.log('ShowResultValue:::',ShowResultValue);
        component.set("v.getBarrelId", ShowResultValue);

        var BarrelId = component.get("v.getBarrelId");
        console.log('BarrelId is::::',BarrelId);
        var sampleKitId = component.get("v.getSampleKitlId");
        console.log('sampleKitId is::::',sampleKitId);
        if((BarrelId != null || BarrelId != '' || BarrelId != undefined) && 
           (sampleKitId != null || sampleKitId != '' || sampleKitId != undefined)){
            
            var action5=component.get('c.createNewSamples');

            action5.setParams({
                samplekitId : sampleKitId,
                barrelId : BarrelId
            });
            action5.setCallback(this,function(res){     
                var state=res.getState();
                if(state==="SUCCESS"){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "type":"Success",
                        "message": "Sample record has been created successfully."
                    }); 
                    toastEvent.fire();  
                }
            });
            $A.enqueueAction(action5);
            $A.get('e.force:refreshView').fire();
        }
        
    },
    
    
})