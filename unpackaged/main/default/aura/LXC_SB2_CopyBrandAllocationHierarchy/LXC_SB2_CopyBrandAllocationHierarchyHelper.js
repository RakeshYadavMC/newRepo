({
    showToast: function (title, message, type) {
        var toastEvent = $A.get('e.force:showToast');
        toastEvent.setParams({
            title: title,
            message: message,
            type: type,
            duration: 3000,
        });
        toastEvent.fire();
    },
    // method to toggle the errors
    toggleErrors: function (component, errors, hasError) {
        component.set('v.hasError', hasError);
        component.set('v.errors', errors);
    },
    
    // method to toggle the loader
    toggleLoader: function(component, isLoading) {
        component.set('v.isLoading', isLoading);
    },
    closeTab: function (cmp) {
        var workspaceAPI = cmp.find('workspace');
        workspaceAPI
        .getFocusedTabInfo()
        .then(function (response) {
            var focusedTabId = response.tabId;
            workspaceAPI.closeTab({ tabId: focusedTabId });
        })
        .catch(function (error) {
            console.log(error);
        });
    },
    navigateToSObject: function (id) {
        var navEvt = $A.get('e.force:navigateToSObject');
        navEvt.setParams({
            recordId: id,
            slideDevName: 'detail',
        });
        navEvt.fire();
    },
    checkIfHierarchyIsAvaiable: function(component, Event, Helper) {
        const action = component.get('c.fetchHierarchyBrandAllocation');
        action.setParams({
            recordId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                var lstCountryAllocation = JSON.parse(JSON.stringify(response.getReturnValue()));
                if(lstCountryAllocation.length > 0) {
                    component.set('v.isAlredyHierarchy', true);
                }
                this.getBrandAllocations(component, event, helper);
            }
        });
        $A.enqueueAction(action);
        
    },
    getBrandAllocations: function(component, Event, Helper) {
        var brandId = component.get('v.data.Brand__r.Id');
        var brandAllocId = component.get('v.data.Id');
        component.set('v.brandAllocationFilter', [
            {
                field: 'Brand__c',
                operator: '=',
                value: `${brandId}`,
            },
            {
            field: 'Status__c',
            operator: '!=',
            value: 'InActive',
            },
            {
            field: 'Id',
            operator: '!=',
            value: `${brandAllocId}`,
            },
        ]);
    },
    handleBrandAllocationValueChange: function (component) {
        var data = component.get('v.brandAllocationValue');
        component.set('v.hasError',false);
        if (data) {
            if(data.Id != null) {
                component.set('v.BrandAllocationId', data.Id);
            } else {
                component.set('v.BrandAllocationId', data);
            }
            
            const action = component.get('c.fetchHierarchyBrandAllocation');
            action.setParams({
                recordId: component.get('v.BrandAllocationId')
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === 'SUCCESS') {
                    var lstCountryAllocation = JSON.parse(JSON.stringify(response.getReturnValue()));
                    if(lstCountryAllocation.length == 0) {
                        component.set('v.hasError',true);
                        let errorList = [];
                        errorList.push('Hierarchy for this Selected Brand Allocation Does not exist cannot copy Hierarachy from this');
                        component.set('v.errors',errorList);
                        console.log(errorList +component.get('v.errors'));
                    }
                }
            });
            $A.enqueueAction(action);
        } else {
            
        }
    },
    createRecord: function (component, event, helper) {
        var action = component.get('c.copyGeographicalHierarchy');
        action.setParams({
            brandAllocationId: component.get('v.BrandAllocationId'),
            currentBrandAllocationId: component.get('v.recordId')
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                this.showToast('Success!', 'The record has been created successfully.', 'success');
                var dismissActionPanel = $A.get("e.force:closeQuickAction");
                dismissActionPanel.fire();
                this.navigateToSObject(response.getReturnValue().Id);
            } else if (state == 'ERROR') {
                let errors = response.getError();
                let errorMessages = []; 
                if(errors && Array.isArray(errors) && errors.length > 0) {
                    errors.forEach((error, index) => {
                        errorMessages.push(error.message);
                        if(index == errors.length - 1) {
                        this.toggleErrors(component, errorMessages, true);
                    }
                    });
                    } else {
                        this.showToast('Error!', 'There is an error while creating the record.', 'error');
                    }
                    }
                        this.toggleLoader(component, false);
                    });
                        this.toggleErrors(component, [], false);
                        this.toggleLoader(component, true);
                        $A.enqueueAction(action);
                    },
                        
                    })