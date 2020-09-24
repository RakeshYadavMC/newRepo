({
    getStateAllocations: function(component, Event, Helper) {
        const action = component.get('c.getStateAllocationInfoForLeafNode');
        action.setParams({
            recordId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lstStateAlloc = JSON.parse(JSON.stringify(response.getReturnValue()));
                for(var i=0; i<lstStateAlloc.length;i++){
                    var stateAlloc = lstStateAlloc[i];
                    if(stateAlloc.Id == component.get('v.recordId')){
                        if(stateAlloc.Is_Active__c == true){
                            component.set('v.isActiveRecord',true);
                        }
                        if(stateAlloc.Is_Leaf_Node__c == true){
                            component.set('v.isLeafNodeRecord',true);
                        } else{
                            component.set('v.isLeafNodeRecord',false);
                        }
                        this.getBrandAllocationInfo(component, Event, Helper, stateAlloc.Brand_Allocation__c);
                    }
                }
                if(lstStateAlloc.length > 1){
                    component.set('v.hasSibling',true);
                }
            }
        });
        $A.enqueueAction(action);
    },
     
    updateStateAllocations: function(component, Event, Helper) {
        const action = component.get('c.removeStateAllocation');
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