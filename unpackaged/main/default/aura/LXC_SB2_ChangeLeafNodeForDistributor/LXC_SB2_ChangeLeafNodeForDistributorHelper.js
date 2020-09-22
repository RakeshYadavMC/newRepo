({
    getDistributorAllocations: function(component, Event, Helper) {
        const action = component.get('c.getDistributorAllocationInfo');
        action.setParams({
            recordId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lstBrandCountryRegionStateDistriAllocation = JSON.parse(JSON.stringify(response.getReturnValue()));
                for(var i=0; i<lstBrandCountryRegionStateDistriAllocation.length;i++){
                    var brandCountryRegionStateDistriAllocation = lstBrandCountryRegionStateDistriAllocation[i];
                    if(brandCountryRegionStateDistriAllocation.Id == component.get('v.recordId')){
                        if(brandCountryRegionStateDistriAllocation.Is_Active__c == true){
                            component.set('v.isActiveRecord',true);
                        }
                        if(brandCountryRegionStateDistriAllocation.Is_Leaf_Node__c == true){
                            component.set('v.isLeafNodeRecord',true);
                        }
                        this.getBrandAllocationInfo(component, Event, Helper, brandCountryRegionStateDistriAllocation.Brand_Allocation__c);
                    }
                }
                if(lstBrandCountryRegionStateDistriAllocation.length > 1){
                    component.set('v.hasSibling',true);
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    updateDistributorAllocations: function(component, Event, Helper) {
        const action = component.get('c.removeLeafDistributorAllocation');
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
    },
    getBrandAllocationInfo: function(component, Event, Helper, brandAllocaId) {
        const action = component.get('c.getBrandAllocationInfo');
        action.setParams({
            recordId: brandAllocaId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lstBrandAlloc = JSON.parse(JSON.stringify(response.getReturnValue()));
                console.log(lstBrandAlloc);
                for(var i=0; i<lstBrandAlloc.length;i++){
                    var brandAlloc = lstBrandAlloc[i];
                    if(brandAlloc.Status__c == 'Expired' || brandAlloc.Status__c == 'Inactive') {
                        component.set('v.brandAllocExpired', true);
                    }
                }
            }
        });
        $A.enqueueAction(action);
    }
    
})