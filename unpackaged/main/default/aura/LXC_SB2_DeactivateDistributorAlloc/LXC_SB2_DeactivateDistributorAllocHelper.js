({
    getBrandCountryRegionStateDistributorAllocations: function(component, Event, Helper) {
        const action = component.get('c.getBrandCountryRegionStateDistributorAllocation');
        action.setParams({
            recordId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lstBrandCountryRegionStateDistriAllocation = JSON.parse(JSON.stringify(response.getReturnValue()));
                for(var i=0; i<lstBrandCountryRegionStateDistriAllocation.length;i++){
                    var brandCountryRegionStateDistriAllocation = lstBrandCountryRegionStateDistriAllocation[0];
                    if(brandCountryRegionStateDistriAllocation.Is_Active__c == true){
                        component.set('v.recordIsActive',true);
                    }
                }
                
            }
        });
        $A.enqueueAction(action);
    },
        
    updateBrandCountryRegionStateDistributorAllocation: function(component, Event, Helper) {
        const action = component.get('c.deactivateDistributorAllocation');
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