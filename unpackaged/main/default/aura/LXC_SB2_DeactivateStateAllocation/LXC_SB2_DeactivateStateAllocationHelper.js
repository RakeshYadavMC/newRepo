({
    getBrandCountryRegionStateAllocations: function(component, Event, Helper) {
        const action = component.get('c.getBrandCountryRegionStateAllocation');
        action.setParams({
            recordId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lstBrandCountryRegionStateAllocation = JSON.parse(JSON.stringify(response.getReturnValue()));
                for(var i=0; i<lstBrandCountryRegionStateAllocation.length;i++){
                    var brandCountryRegionStateAllocation = lstBrandCountryRegionStateAllocation[0];
                    if(brandCountryRegionStateAllocation.Is_Active__c == true){
                        component.set('v.recordIsActive',true);
                    }
                }
                
            }
        });
        $A.enqueueAction(action);
    },
        
    updateBrandCountryRegionStateAllocation: function(component, Event, Helper) {
        const action = component.get('c.deactivateStateAllocation');
        action.setParams({
            recordId: component.get('v.recordId')
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
    
})