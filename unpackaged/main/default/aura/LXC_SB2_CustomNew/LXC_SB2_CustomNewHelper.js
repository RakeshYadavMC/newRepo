({
    // constant for parent lookup
    PARENT_LOOKUP: {
        Brand_Country_Allocation__c: ['brandAllocationValue', 'Brand Allocation'],
        Brand_Country_Region_Allocation__c: ['brandCountryAllocationValue', 'Brand Country Allocation'],
        Brand_Country_Region_State_Allocation__c: [
            'brandCountryRegionAllocationValue',
            'Brand Country Region Allocation',
        ],
        Brand_Country_Region_State_Dist_Alloc__c: [
            'brandCountryRegionStateAllocationValue',
            'Brand Country Region State Allocation',
        ],
    },
    HEADER_TITLE: {
        Brand_Country_Allocation__c: 'Country Level Allocation',
        Brand_Country_Region_Allocation__c: 'Region Level Allocation',
        Brand_Country_Region_State_Allocation__c: 'State Level Allocation',
        Brand_Country_Region_State_Dist_Alloc__c: 'Distributor Level Allocation'
    },

    // method for server call to creat allocation record
    createRecord: function (cmp, objectName) {
        var action = cmp.get(`c.create${objectName}`);
        let name = cmp.get('v.allocationName') + '~' + cmp.get('v.geographicalName');
        action.setParams({
            recordToInsert: cmp.get(`v.new${objectName}`),
            recordName: name
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                this.showToast('Success!', 'The record has been created successfully.', 'success');
                this.closeTab(cmp);
                this.navigateToSObject(response.getReturnValue().Id);
            } else if (state == 'ERROR') {
                let errors = response.getError();
                let errorMessages = []; 
                if(errors && Array.isArray(errors) && errors.length > 0) {
                    errors.forEach((error, index) => {
                        errorMessages.push(error.message);
                        if(index == errors.length - 1) {
                            this.toggleErrors(cmp, errorMessages, true);
                        }
                    });
                } else {
                    this.showToast('Error!', 'There is an error while creating the record.', 'error');
                }
            }
            this.toggleLoader(cmp, false);
        });
        this.toggleErrors(cmp, [], false);
        this.toggleLoader(cmp, true);
        $A.enqueueAction(action);
    },

    // helper method to show taost notification
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

    // method to go to created record detail page
    navigateToSObject: function (id) {
        var navEvt = $A.get('e.force:navigateToSObject');
        navEvt.setParams({
            recordId: id,
            slideDevName: 'detail',
        });
        navEvt.fire();
    },

    // method to close the current tab
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

    // method to toggle the errors
    toggleErrors: function (cmp, errors, hasError) {
        cmp.set('v.hasError', hasError);
        cmp.set('v.errors', errors);
    },

    // method to toggle the loader
    toggleLoader: function(cmp, isLoading) {
        cmp.set('v.isLoading', isLoading);
    },

    // method to validate the form
    validateForm: function (cmp, callback) {
        let objectName = cmp.get('v.objectName');
        let parentLookup = this.PARENT_LOOKUP[cmp.get('v.sObjectName')];
        let object = cmp.get(`v.new${objectName}`);
        let objectArray = Object.entries(object);
        let objectArrayLength = objectArray.length;
        let errors = [];
        this.toggleErrors(cmp, errors, false);
        let isLeafNode = cmp.get('v.isLeafNode');
        if (!cmp.get(`v.${parentLookup[0]}`)) {
            errors = [];
            errors.push(parentLookup[1] + ' cannot be empty');
            this.toggleErrors(cmp, errors, true);
            callback(false);
        } else {
            errors = [];
            objectArray.forEach(([key, value], index) => {
                let fieldName = key.slice(0, -3).split('_').join(' ');
                if (!value || !(~value)) {
                    if (key == 'Allocations_Per_Interval__c' && isLeafNode) {
                        if(value < 0) {
                            errors.push(fieldName + ' should be 0 or more.');
                        } else if(value === '') {
                            errors.push(fieldName + ' is not valid.');
                        }
                    } else if (typeof value != 'boolean' && key != 'Allocations_Per_Interval__c') {
                        errors.push(fieldName + ' cannot be empty.');
                    }
                }
                if (index == objectArrayLength - 1 && errors.length >= 1) {
                    this.toggleErrors(cmp, errors, true);
                    callback(false);
                }
                if (index == objectArrayLength - 1 && errors.length == 0) {
                    callback(true);
                }
            });
        }
    },

    // helper method to handle changes for Is Leaf Node
    handleChange: function (cmp) {
        var isChecked = cmp.find('isLeafNode').get('v.checked');
        let objectName = cmp.get('v.objectName');
        cmp.set(`v.new${objectName}.Is_Leaf_Node__c`, isChecked);
        if (!isChecked) {
            cmp.set(`v.new${objectName}.Allocations_Per_Interval__c`, 0);
        }
    },

    // helper method to handle brand allocation value change
    handleBrandAllocationValueChange: function (cmp) {
        var data = cmp.get('v.brandAllocationValue');
        if (data) {
            cmp.set('v.newBrandCountryAllocation.Brand_Allocation__c', data.Id);
            cmp.set('v.allocationName', data.Name ? data.Name : data.data.Name);
            this.toggleErrors(cmp, [], false);
        } else {
            cmp.set('v.newBrandCountryAllocation.Brand_Allocation__c', '');
            cmp.set('v.isLeafNode', false);
            cmp.set('v.newBrandCountryAllocation.Allocations_Per_Interval__c', 0);
            cmp.set('v.countryValue', '');
            this.toggleErrors(cmp, [], false);
        }
    },

    // helper method to handle country value change
    handleCountryValueChange: function (cmp) {
        var data = cmp.get('v.countryValue');
        if (data) {
            cmp.set('v.newBrandCountryAllocation.Country__c', data.Id);
            cmp.set('v.geographicalName', data['Alias__c'] ? data['Alias__c'] : data.data['Alias__c']);
            this.toggleErrors(cmp, [], false);
        } else {
            cmp.set('v.newBrandCountryAllocation.Country__c', '');
            cmp.set('v.isLeafNode', false);
            cmp.set('v.newBrandCountryAllocation.Allocations_Per_Interval__c', 0);
            this.toggleErrors(cmp, [], false);
        }
    },

    // helper method to handle brand country allocation value change
    handleBrandCountryAllocationValueChange: function (cmp) {
        var value = cmp.get('v.brandCountryAllocationValue');
        if (value) {
            var data = value.data.data ? value.data.data : value.data;
            cmp.set('v.regionFilter', [
                {
                    field: 'Country__c',
                    operator: '=',
                    value: `${data.Country__c}`,
                },
            ]);
            cmp.set('v.newBrandCountryRegionAllocation.Brand_Country_Allocation__c', value.Id);
            cmp.set('v.allocationName', data.Name ? data.Name : data.data.Name);
            this.toggleErrors(cmp, [], false);
        } else {
            cmp.set('v.newBrandCountryRegionAllocation.Brand_Country_Allocation__c', '');
            cmp.set('v.isLeafNode', false);
            cmp.set('v.newBrandCountryRegionAllocation.Allocations_Per_Interval__c', 0);
            cmp.set('v.regionValue', '');
            this.toggleErrors(cmp, [], false);
        }
    },

    // helper method to handle region value change
    handleRegionValueChange: function (cmp) {
        var data = cmp.get('v.regionValue');
        if (data) {
            cmp.set('v.newBrandCountryRegionAllocation.Region__c', data.Id);
            cmp.set('v.geographicalName', data.Name ? data.Name : data.data.Name);
            this.toggleErrors(cmp, [], false);
        } else {
            cmp.set('v.newBrandCountryRegionAllocation.Region__c', '');
            cmp.set('v.isLeafNode', false);
            cmp.set('v.newBrandCountryRegionAllocation.Allocations_Per_Interval__c', 0);
            this.toggleErrors(cmp, [], false);
        }
    },

    // helper method to handle brand country region allocation value change
    handleBrandCountryRegionAllocationValueChange: function (cmp) {
        var value = cmp.get('v.brandCountryRegionAllocationValue');
        if (value) {
            var data = value.data.data ? value.data.data : value.data;
            cmp.set('v.stateFilter', [
                {
                    field: 'IsActive__c',
                    operator: '=',
                    stringWrap: false,
                    value: true,
                },
                {
                    type: 'operator',
                    value: 'AND',
                },
                {
                    field: 'Region__c',
                    operator: '=',
                    value: `${data.Region__c}`,
                },
                {
                    type: 'operator',
                    value: 'AND',
                },
                {
                    field: 'Country__c',
                    operator: '=',
                    value: `${data.Region__r.Country__c}`,
                },
            ]);
            var showLeafNode = data.Is_Leaf_Node__c || data.Brand_Country_Allocation__r.Is_Leaf_Node__c;
            cmp.set('v.newBrandCountryRegionStateAllocation.Brand_Country_Region_Allocation__c', value.Id);
            cmp.set('v.showLeafNode', !showLeafNode);
            cmp.set('v.allocationName', data.Name ? data.Name : data.data.Name);
            this.toggleErrors(cmp, [], false);
        } else {
            cmp.set('v.newBrandCountryRegionStateAllocation.Brand_Country_Region_Allocation__c', '');
            cmp.set('v.isLeafNode', false);
            cmp.set('v.showLeafNode', false);
            cmp.set('v.newBrandCountryRegionStateAllocation.Allocations_Per_Interval__c', 0);
            cmp.set('v.stateValue', '');
            this.toggleErrors(cmp, [], false);
        }
    },

    // helper method to handle state value change
    handleStateValueChange: function (cmp) {
        var data = cmp.get('v.stateValue');
        if (data) {
            cmp.set('v.newBrandCountryRegionStateAllocation.State__c', data.Id);
            cmp.set('v.geographicalName',  data['Alias__c'] ? data['Alias__c'] : data.data['Alias__c']);
            this.toggleErrors(cmp, [], false);
        } else {
            cmp.set('v.newBrandCountryRegionStateAllocation.State__c', '');
            cmp.set('v.isLeafNode', false);
            cmp.set('v.newBrandCountryRegionStateAllocation.Allocations_Per_Interval__c', 0);
            this.toggleErrors(cmp, [], false);
        }
    },

    // helper method to handle brand country region state allocation value change
    handleBrandCountryRegionStateAllocationValueChange: function (cmp) {
        let value = cmp.get('v.brandCountryRegionStateAllocationValue');
        if (value) {
            let data = value.data.data ? value.data.data : value.data;
            cmp.set('v.accountFilter', [
                {
                    field: 'RecordType.Name',
                    operator: '=',
                    value: 'Distributor',
                },
            ]);
            let isLeafNode = data.Is_Leaf_Node__c || data.Brand_Country_Region_Allocation__r.Is_Leaf_Node__c || data.Brand_Country_Region_Allocation__r.Brand_Country_Allocation__r.Is_Leaf_Node__c;
            cmp.set('v.newBrandCountryRegionStateDistAlloc.Brand_Country_Region_State_Allocation__c', value.Id);
            cmp.set('v.newBrandCountryRegionStateDistAlloc.Is_Leaf_Node__c', !isLeafNode);
            cmp.set('v.isLeafNode', !isLeafNode);
            this.toggleErrors(cmp, [], false);
        } else {
            cmp.set('v.newBrandCountryRegionStateDistAlloc.Brand_Country_Region_State_Allocation__c', '');
            cmp.set('v.newBrandCountryRegionStateAllocation.Allocations_Per_Interval__c', 0);
            cmp.set('v.accountValue', '');
            cmp.set('v.newBrandCountryRegionStateDistAlloc.Is_Leaf_Node__c', false);
            this.toggleErrors(cmp, [], false);
        }
    },

    // helper method to handle account value change
    handleAccountValueChange: function (cmp) {
        var data = cmp.get('v.accountValue');
        if (data) {
            cmp.set('v.newBrandCountryRegionStateDistAlloc.Account__c', data.Id);
            this.toggleErrors(cmp, [], false);
        } else {
            cmp.set('v.newBrandCountryRegionStateDistAlloc.Account__c', '');
            cmp.set('v.newBrandCountryRegionStateAllocation.Allocations_Per_Interval__c', 0);
            this.toggleErrors(cmp, [], false);
        }
    }
});