({
    invoke : function(component, event, helper) {
        var action = component.get("c.updateBonusCoupon");
        action.setParams({
            'objBonusCoupon': component.get('v.objReatilBonusCoupon')
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            var res = response.getReturnValue();
            if (state === "SUCCESS") {
                console.log('Bonus Coupon Successfully Redeemed');
            }
            else{
                console.log('Something went wrong'); 
            }           
        });
        $A.enqueueAction(action);
    }
})