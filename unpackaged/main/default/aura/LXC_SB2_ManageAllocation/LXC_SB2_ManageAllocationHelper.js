({
    // constants to store api names for from & to records
    FROM_API: {
        Region: 'From_Region_Allocation__c',
        State: 'From_State_Allocation__c',
        Distributor: 'From_Distributor_Allocation__c',
    },
    TO_API: {
        Region: 'To_Region_Allocation__c',
        State: 'To_State_Allocation__c',
        Distributor: 'To_Distributor_Allocation__c',
    },
    OBJECT_NAME: {
        Brand_Country_Region_Allocation__c: 'Region',
        Brand_Country_Region_State_Allocation__c: 'State',
        Brand_Country_Region_State_Dist_Alloc__c: 'Distributor'
    },

    // method to fetch data for filters
    fetchData: function (cmp) {
        const action = cmp.get('c.getBrandAndCountryAllocationData');

        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                var value = response.getReturnValue();
                cmp.set('v.brandAllocation', value['brandAllocation']);
            }
            this.toggleLoader(cmp, false);
        });

        this.toggleLoader(cmp, true);
        $A.enqueueAction(action);
    },

    // method to fetch leaf nodes data
    fetchAllocationData: function (cmp, objectName, type) {
        const action = cmp.get('c.getAllocationData');
        const brandAllocation = cmp.get('v.brandAllocation');
        const brandAllocationKey = cmp.get('v.brand') + ' | ' + cmp.get('v.programTypeAndInterval');
        const brandAllocationId = brandAllocation[brandAllocationKey];
        const countryAllocationId =
            brandAllocation['countries'][cmp.get('v.programTypeAndInterval')][cmp.get('v.country')];

        action.setParams({
            objectName: objectName,
            brandAllocation: brandAllocationId,
            countryAllocation: countryAllocationId,
        });

        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                var value = response.getReturnValue();

                if (Array.isArray(value) && value.length == 0) {
                    this.showToast(
                        'Information',
                        `No record found for ${this.OBJECT_NAME[objectName]} Allocation`,
                        'info'
                    );
                } else {
                    if (objectName == 'Brand_Country_Region_State_Dist_Alloc__c') {
                        value.map(
                            (item) =>
                                (item.Name =
                                    item.Brand_Country_Region_State_Allocation__r.Name + '~' + item.Account__r.Name)
                        );
                        cmp.set(`v.${type}Allocations`, value);
                    } else {
                        cmp.set(`v.${type}Allocations`, value);
                    }
                }
            }
            this.toggleLoader(cmp, false);
        });
        this.toggleLoader(cmp, true);
        $A.enqueueAction(action);
    },

    // method to create allocation record
    createRecord: function (cmp) {
        const action = cmp.get('c.createLoggerRecord');

        const manageAllocation = cmp.get('v.manageAllocation');
        const isTransfer = manageAllocation.Change_Type__c == 'Transfer';
        const fromAllocationValue = cmp.get('v.fromAllocationValue');
        const fromAllocations = cmp.get('v.fromAllocations');
        const fromAllocationData = fromAllocations.find((item) => item.Id == fromAllocationValue);

        manageAllocation['From_Original_Allocation__c'] = fromAllocationData.Allocations_Per_Interval__c;

        const fromAllocation = {
            Id: fromAllocationValue,
            Allocations_Per_Interval__c: isTransfer
                ? fromAllocationData.Allocations_Per_Interval__c - manageAllocation.Allocation_Changed__c
                : manageAllocation.Allocation_Changed__c,
        };

        const toAllocation = {};

        if (isTransfer) {
            const toAllocationValue = cmp.get('v.toAllocationValue');
            const toAllocations = cmp.get('v.toAllocations');
            const toAllocationData = toAllocations.find((item) => item.Id == toAllocationValue);
            manageAllocation['To_Original_Allocation__c'] = toAllocationData.Allocations_Per_Interval__c;
            toAllocation['Id'] = toAllocationValue;
            toAllocation['Allocations_Per_Interval__c'] =
                parseInt(toAllocationData.Allocations_Per_Interval__c) +
                parseInt(manageAllocation.Allocation_Changed__c);
        }

        action.setParams({
            logger: manageAllocation,
            fromAllocation: fromAllocation,
            toAllocation: isTransfer ? toAllocation : null,
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state == 'SUCCESS') {
                this.showToast('Success!', 'Allocation has been updated successfully.', 'success');
                this.setDefaults(cmp);
            } else if (state == 'ERROR') {
                console.log(response.getError());
            }
            this.toggleLoader(cmp, false);
        });

        this.toggleLoader(cmp, true);

        $A.enqueueAction(action);
    },

    // method to toggle the loader
    toggleLoader: function (cmp, isLoading) {
        cmp.set('v.isLoading', isLoading);
    },

    // method to show error message in toast notification
    showToast: function (title, message, type) {
        var toastEvent = $A.get('e.force:showToast');
        toastEvent.setParams({
            title: title,
            message: message,
            type: type,
        });
        toastEvent.fire();
    },

    // method to perform form validation
    validateForm: function (cmp) {
        return cmp.find('formInput').reduce(function (validSoFar, inputCmp) {
            inputCmp.showHelpMessageIfInvalid();
            return validSoFar && inputCmp.checkValidity();
        }, true);
    },

    // method to set attribute values to default
    setDefaults: function (cmp) {
        cmp.set('v.countries', []);
        cmp.set('v.programTypesAndTimeIntervals', []);
        cmp.set('v.brand', '');
        cmp.set('v.programTypeAndInterval', '');
        cmp.set('v.country', '');
        cmp.set('v.from', '');
        cmp.set('v.to', '');
        cmp.set('v.fromAllocationLabel', '');
        cmp.set('v.toAllocationLabel', '');
        cmp.set('v.fromAllocationValue', '');
        cmp.set('v.toAllocationValue', '');
        cmp.set('v.fromAllocations', []);
        cmp.set('v.toAllocations', []);
        cmp.set('v.totalAllocation', '');
        cmp.set('v.usedAllocation', '');
        cmp.set('v.remainingAllocation', '');
    },

    handleBrandChange: function (cmp) {
        var value = cmp.get('v.brand');
        cmp.set('v.programTypesAndTimeIntervals', []);
        cmp.set('v.programTypeAndInterval', '');
        if (value) {
            cmp.set('v.programTypesAndTimeIntervals', cmp.get('v.brandAllocation')['brands'][value]);
        }
    },

    handleProgramTypeAndIntervalChange: function (cmp) {
        var value = cmp.get('v.programTypeAndInterval');
        cmp.set('v.countries', []);
        cmp.set('v.country', '');
        cmp.set('v.manageAllocation.Brand_Allocation__c', '');
        if (value) {
            if (cmp.get('v.brandAllocation')['countries'][value]) {
                cmp.set('v.countries', Object.keys(cmp.get('v.brandAllocation')['countries'][value]));
                cmp.set(
                    'v.manageAllocation.Brand_Allocation__c',
                    cmp.get('v.brandAllocation')[cmp.get('v.brand') + ' | ' + value]
                );
            }
        }
    },

    handleCountryChange: function (cmp) {
        cmp.set('v.from', '');
    },

    handleFromChange: function (cmp) {
        var value = cmp.get('v.from');
        cmp.set('v.fromAllocationValue', '');
        cmp.set('v.fromAllocations', '');
        cmp.set('v.manageAllocation.Transfer_Modification_Reason__c', '');
        cmp.set('v.manageAllocation.Allocation_Changed__c', 1);
        cmp.set('v.to', '');
        if (value) {
            var fromToValues = cmp.get('v.fromToValues');
            var index = fromToValues.findIndex((item) => item.value == value);
            cmp.set('v.fromAllocationLabel', fromToValues[index].label);
            this.fetchAllocationData(cmp, value, 'from');
        }
    },

    handleToChange: function (cmp) {
        var value = cmp.get('v.to');
        cmp.set('v.toAllocationValue', '');
        cmp.set('v.toAllocations', '');
        if (value) {
            var fromToValues = cmp.get('v.fromToValues');
            var index = fromToValues.findIndex((item) => item.value == value);
            cmp.set('v.toAllocationLabel', fromToValues[index].label);
            if (cmp.get('v.fromAllocationLabel') == cmp.get('v.toAllocationLabel')) {
                let fromAllocationValue = cmp.get('v.fromAllocationValue');
                var fromAllocations = cmp.get('v.fromAllocations');
                var allocationIndex = fromAllocations.findIndex((item) => item.Id == fromAllocationValue);
                var toAllocations = fromAllocations.filter(function (fromAllocation, index) {
                    return index != allocationIndex;
                });
                if (toAllocations.length > 0) {
                    cmp.set('v.toAllocations', toAllocations);
                } else {
                    this.showToast(
                        'Information',
                        `There is only one record for ${cmp.get(
                            'v.fromAllocationLabel'
                        )} Allocation. So you cannot transfer allocation at this level.`,
                        'info'
                    );
                }
            } else {
                this.fetchAllocationData(cmp, value, 'to');
            }
        }
    },

    handleFromAllocationValueChange: function (cmp) {
        var value = cmp.get('v.fromAllocationValue');
        cmp.set('v.manageAllocation.From_Region_Allocation__c', '');
        cmp.set('v.manageAllocation.From_State_Allocation__c', '');
        cmp.set('v.manageAllocation.From_Distributor_Allocation__c', '');
        cmp.set('v.manageAllocation.Transfer_Modification_Reason__c', '');
        cmp.set('v.manageAllocation.Allocation_Changed__c', 1);
        cmp.set('v.to', '');
        if (value) {
            var fromAllocations = cmp.get('v.fromAllocations');
            var index = fromAllocations.findIndex((item) => item.Id == value);
            cmp.set('v.totalAllocation', fromAllocations[index].Allocations_Per_Interval__c);
            cmp.set('v.usedAllocation', fromAllocations[index].Used_Allocations__c);
            cmp.set('v.remainingAllocation', fromAllocations[index].Remaining_Allocations__c);
            if (
                cmp.get('v.manageAllocation.Change_Type__c') == 'Transfer' &&
                !fromAllocations[index].Remaining_Allocations__c
            ) {
                this.showToast(
                    'Information',
                    `There is 0 remaining allocation for selected ${cmp.get(
                        'v.fromAllocationLabel'
                    )}. So you cannot transfer the allocation,`,
                    'info'
                );
            }
            let fromApi = this.FROM_API[cmp.get('v.fromAllocationLabel')];
            cmp.set(`v.manageAllocation.${fromApi}`, value);
        }
    },
    handleToAllocationValueChange: function (cmp) {
        var value = cmp.get('v.toAllocationValue');
        cmp.set('v.manageAllocation.To_Region_Allocation__c', '');
        cmp.set('v.manageAllocation.To_State_Allocation__c', '');
        cmp.set('v.manageAllocation.To_Distributor_Allocation__c', '');
        if (value) {
            let toApi = this.TO_API[cmp.get('v.toAllocationLabel')];
            cmp.set(`v.manageAllocation.${toApi}`, value);
        }
        if (value) {
            var toAllocations = cmp.get('v.toAllocations');
            var index = toAllocations.findIndex((item) => item.Id == value);
            cmp.set('v.toTotalAllocation', toAllocations[index].Allocations_Per_Interval__c);
            cmp.set('v.toUsedAllocation', toAllocations[index].Used_Allocations__c);
            cmp.set('v.toRemainingAllocation', toAllocations[index].Remaining_Allocations__c);
        }
    },
});