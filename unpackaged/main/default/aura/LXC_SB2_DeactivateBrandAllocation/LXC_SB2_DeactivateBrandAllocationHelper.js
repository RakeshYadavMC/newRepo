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
                    component.set('v.newBrandAllocation', lstBrandAllocation[0]);
                    this.validateNewBrandAllocation(component, Event, Helper);
                }
            }
        });
        $A.enqueueAction(action);
    },
    updateBrandAllocation: function(component, Event, Helper) {
        const action = component.get('c.updateAllocation');
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
    validateNewBrandAllocation : function(component, event, helper) {
        const action = component.get('c.getFutureBrandAllocation');
        action.setParams({
            newBrandAllocation: component.get('v.newBrandAllocation')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                if(response.getReturnValue() != null) { 
                	if(response.getReturnValue().status == true){
						component.set("v.showList", false);
                	} else {
                        var brandAllocName = component.get("v.newBrandAllocation.Name");
                    	var listOfkeys = [];
                    	for (var key in response.getReturnValue().responseMap) {
                            if(brandAllocName != key) {
                                listOfkeys.push(key);
                            }
                    	}
                    	component.set("v.lstExistingBrandAlloc", listOfkeys);
                        if(listOfkeys.length > 0) {
                            component.set("v.showList", true);
                        }
                	}
                } else {
                    component.set("v.showList", false);
                }                
            } else if (state == 'ERROR') {
                let errors = response.getError();
                let errorMessages = []; 
                if(errors && Array.isArray(errors) && errors.length > 0) {
                    errors.forEach((error, index) => {
                        errorMessages.push(error.message);
                        console.log(errorMessages);
                        if(index == errors.length - 1) {
                        this.toggleErrors(component, errorMessages, true);
                    }
                    });
                 } else {
                        this.showToast('Error!', 'The is an error while creating the record.', 'error');
                 }
             }
         });
         $A.enqueueAction(action);
      },
      deactivateAllBrandAllocation : function(component, Event, Helper) {
		var brandList = component.get("v.lstExistingBrandAlloc"); 
        brandList.push(component.get("v.newBrandAllocation.Name"));
        component.set("v.lstExistingBrandAlloc", brandList);
        const action = component.get('c.deactivateBrandAllocation');
        action.setParams({
            lstBrandAlloc: component.get('v.lstExistingBrandAlloc'),
            status: 'Inactive'
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