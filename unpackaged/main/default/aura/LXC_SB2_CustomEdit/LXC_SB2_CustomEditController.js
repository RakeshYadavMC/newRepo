({
    //method to be called when record is loaded
    handleRecordUpdated: function (cmp, event, helper) {
        var eventParams = event.getParams();
        var isAllocationProvided = false;
        if (eventParams.changeType === 'LOADED') {
            if(cmp.get('v.sObjectName') == 'Brand_Country_Region_State_Dist_Alloc__c') {
                var data = cmp.get('v.data');
                cmp.set('v.recordToUpdate', data.Name);
                var isParentLeafNode =
                data.Brand_Country_Region_State_Allocation__r.Is_Leaf_Node__c ||
                data.Brand_Country_Region_State_Allocation__r.Brand_Country_Region_Allocation__r.Is_Leaf_Node__c ||
                data.Brand_Country_Region_State_Allocation__r.Brand_Country_Region_Allocation__r
                    .Brand_Country_Allocation__r.Is_Leaf_Node__c;
                if(cmp.get('v.data.Allocations_Per_Interval__c') > 0){
                	isAllocationProvided = true;
            	}
            var message = !data.Is_Active__c
                ? 'This record is inactive. You cannot edit this record.'
                : 'Parent is marked as leaf node in hierarchy. So it cannot be edited.';
            if(data.Is_Leaf_Node__c) {
                message = 'This record is already marked as Leaf Node. So you cannot edit it.'
            }
            if(isAllocationProvided) {
                message = 'Allocation already exist for this record. So you cannot edit it.';
            }
            cmp.set('v.message', message);
            cmp.set('v.isParentLeafNode', isParentLeafNode);
            cmp.set('v.isLeafNodeDisabled', data.Is_Leaf_Node__c);
            cmp.set('v.isAllocationProvided', isAllocationProvided);
        }
        }
    },
    handleStateRecordUpdated: function (cmp, event, helper) {
        var eventParams = event.getParams();
        var isAllocationProvided = false;
        if (eventParams.changeType === 'LOADED') {
            if(cmp.get('v.sObjectName') == 'Brand_Country_Region_State_Allocation__c') {
                var data = cmp.get('v.stateData');
                cmp.set('v.recordToUpdate', data.Name);
                if(cmp.get('v.stateData.Allocations_Per_Interval__c') > 0){
                isAllocationProvided = true;
            	}
                var message;
                if(!data.Is_Active__c)
             message = 'This record is inactive. You cannot edit this record.';
            if(!data.Is_Leaf_Node__c) {
                message = 'This record is Not marked as Leaf Node. So you cannot edit it.'
            }
            if(isAllocationProvided) {
                message = 'Allocation already exist for this record. So you cannot edit it.';
            }
                cmp.set('v.message', message);
                cmp.set('v.isLeafNodeDisabled', data.Is_Leaf_Node__c);
                cmp.set('v.isAllocationProvided', isAllocationProvided);
            }
            
            
            
        }
    },
        handleRegionRecordUpdated: function (cmp, event, helper) {
        var eventParams = event.getParams();
        var isAllocationProvided = false;
        if (eventParams.changeType === 'LOADED') {
			if(cmp.get('v.sObjectName') == 'Brand_Country_Region_Allocation__c') {
                var data = cmp.get('v.regionData');
                cmp.set('v.recordToUpdate', data.Name);
                if(cmp.get('v.regionData.Allocations_Per_Interval__c') > 0){
                isAllocationProvided = true;
            	}
            var message = !data.Is_Active__c
                ? 'This record is inactive. You cannot edit this record.'
                : 'Parent is marked as leaf node in hierarchy. So it cannot be edited.';
            if(data.Is_Active__c && data.Is_Leaf_Node__c) {
                message = 'This record is already marked as Leaf Node. So you cannot edit it.'
            } else {
				message = 'This record is not marked as Leaf Node. So you cannot edit it.'
            }
            if(isAllocationProvided) {
                message = 'Allocation already exist for this record. So you cannot edit it.';
            }
            
            cmp.set('v.message', message);
            cmp.set('v.isLeafNodeDisabled', data.Is_Leaf_Node__c);
            cmp.set('v.isAllocationProvided', isAllocationProvided);
            }
        }
    },
        handleCountryRecordUpdated: function (cmp, event, helper) {
        var eventParams = event.getParams();
        var isAllocationProvided = false;
        if (eventParams.changeType === 'LOADED') {
            if(cmp.get('v.sObjectName') == 'Brand_Country_Allocation__c') {
                var data = cmp.get('v.countryData');
                cmp.set('v.recordToUpdate', data.Name);
                if(cmp.get('v.countryData.Allocations_Per_Interval__c') > 0){
                isAllocationProvided = true;
            	}
                if(data != null && data != '') {
                    var message = !data.Is_Active__c
                    ? 'This record is inactive. You cannot edit this record.'
                    : 'Parent is marked as leaf node in hierarchy. So it cannot be edited.';
                    if(data.Is_Active__c && data.Is_Leaf_Node__c) {
                        message = 'This record is already marked as Leaf Node. So you cannot edit it.'
                    } else {
                        message = 'This record is not marked as Leaf Node. So you cannot edit it.'
                    }
                    if(isAllocationProvided) {
                        message = 'Allocation already exist for this record. So you cannot edit it.';
                    }
                    if(!cmp.get('v.countryData.Is_Record_Copied__c')) {
                        message = 'you are not allowed to edit this record';
                    }
                }
                cmp.set('v.isLeafNodeDisabled', data.Is_Leaf_Node__c);
            	cmp.set('v.message', message);
            	cmp.set('v.isAllocationProvided', isAllocationProvided);
            }
        }
    },
    //method to close quick action
    closeQuickAction: function (cmp, evt, helper) {
        helper.closeQuickAction();
    },

    //method to handle save button click
    handleSaveRecord: function (cmp, evt, helper) {
        if(cmp.get('v.sObjectName') == 'Brand_Country_Region_State_Dist_Alloc__c') {
            if ((!cmp.get('v.data.Is_Record_Copied__c')|| cmp.get('v.isAllocationProvided')) && (cmp.get('v.isParentLeafNode') || !cmp.get('v.data.Is_Active__c') || cmp.get('v.data.Is_Leaf_Node__c'))) {
                helper.closeQuickAction();
            } else if (cmp.find('allocationPerInterval').checkValidity()) {
                helper.saveRecord(cmp);
            } else {
                cmp.find('allocationPerInterval').reportValidity();
            }   
        } 
        if(cmp.get('v.sObjectName') == 'Brand_Country_Region_State_Allocation__c'){
            if ( cmp.get('v.isAllocationProvided')) {
                helper.closeQuickAction();
            } else if (cmp.find('allocationPerInterval').checkValidity()) {
                helper.saveStateAlloc(cmp);
            } else {
                cmp.find('allocationPerInterval').reportValidity();
            } 
        }
        if(cmp.get('v.sObjectName') == 'Brand_Country_Region_Allocation__c'){
            if (cmp.get('v.isAllocationProvided')) {
                helper.closeQuickAction();
            } else if (cmp.find('allocationPerInterval').checkValidity()) {
                helper.saveRegionAlloc(cmp);
            } else {
                cmp.find('allocationPerInterval').reportValidity();
            } 
        }
        if(cmp.get('v.sObjectName') == 'Brand_Country_Allocation__c'){
            if (cmp.get('v.isAllocationProvided')) {
                helper.closeQuickAction();
            } else if (cmp.find('allocationPerInterval').checkValidity()) {
                helper.saveCountryAlloc(cmp);
            } else {
                cmp.find('allocationPerInterval').reportValidity();
            } 
        }
    },

    // this method automatic call by aura:waiting event
    showSpinner: function (component, event, helper) {
        component.set('v.isLoading', true);
    },

    // this method automatic call by aura:doneWaiting event
    hideSpinner: function (component, event, helper) {
        component.set('v.isLoading', false);
    },
});