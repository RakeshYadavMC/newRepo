({
    doInit : function(component, event, helper) {
        var shipDate = new Date();
        component.set('v.shipDate', shipDate.getFullYear() + "-" + (shipDate.getMonth() + 1) + "-" + shipDate.getDate());
    },
    setOutput : function(component, event, helper) {
    	//var cmpMsg = component.find("msg");
    	//$A.util.removeClass(cmpMsg, 'hide');
        var expdate = component.find("expdate").get("v.value");
		//alert(expdate);
        //var selectedShipDate = component.get("v.shipDate");
        var oDate = component.find("oDate");
        oDate.set("v.value", expdate);
        //alert(component.get("v.customListStr"));
        component.set("v.BarrelIdset",component.get("v.customListStr"));
        var action = component.get("c.updateShipDate");
		action.setParams({ 
            shipDate : expdate,
            BarrelIds : component.get("v.BarrelIdset")
        });
        //alert(component.get("v.BarrelIdset"));
        // Add callback behavior for when response is received
        action.setCallback(this, function(response) {
            var state = response.getState();
            //alert('====state=='+state);
            //alert('======error'+response.getError().getMessage());
            var errors = response.getError();   
            //alert(errors[0].message);
            if (state === "SUCCESS" && response.getReturnValue()==true) {
                alert('Barrel records are updated successfully!');
                //component.set("v.Contacts", response.getReturnValue());
                console.log('=======',JSON.stringify(response.getReturnValue()));
                $A.get('e.force:refreshView').fire();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "success!",
                    "message": "Barrel records are updated successfully!",
                    "type"  : "success"
                });
                toastEvent.fire();
            }
            else if(response.getReturnValue()==false){
                alert('No Barrel Records found!');
            }else {
                alert('Something went wrong! Please refresh and try again.');
                console.log("Failed with state: " + state);
            }
        });
        // Send action off to be executed
        $A.enqueueAction(action);
        
    }
})