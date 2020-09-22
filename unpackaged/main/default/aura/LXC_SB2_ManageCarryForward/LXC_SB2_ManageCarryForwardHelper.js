({
    getBrandAllocations: function(component, Event, Helper) {
        const action = component.get('c.getBrandAllocation');
        action.setParams({
            recordId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lstBrandAllocation = JSON.parse(JSON.stringify(response.getReturnValue()));
                for(var i=0; i<lstBrandAllocation.length;i++){
                    var brandAllocation = lstBrandAllocation[0];
                    if(brandAllocation.Is_Active__c == true){
                        component.set('v.isActiveRecord',true);
                    }
                    if(brandAllocation.Is_Carry_Forward__c  == true){
                        component.set('v.isCarryForward',true);
                    }
                }
            }
        });
        $A.enqueueAction(action);
    },
    updateBrandAllocation: function(component, Event, Helper) {
        const action = component.get('c.updateCarryForwardAllocation');
        var isCarryForward = component.get('v.isCarryForward');
        if(isCarryForward == true) {
            isCarryForward = false;
        } else {
            isCarryForward = true;
        }
        action.setParams({
            recordId: component.get('v.recordId'),
            isCarryforward: isCarryForward
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                $A.get("e.force:closeQuickAction").fire();
                $A.get('e.force:refreshView').fire();
            }
        });
        $A.enqueueAction(action);
    }
});