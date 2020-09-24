({
    // method to fetch data for filters
    fetchData: function (cmp) {
        const action = cmp.get('c.getHierarchicalData');

        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                var value = response.getReturnValue();
                console.log(JSON.stringify(value, null, 2));
                cmp.set('v.hierarchicalMap', value);
                cmp.set('v.countries', Object.keys(value['hierarchy']));
            }
            this.toggleLoader(cmp, false);
        });

        this.toggleLoader(cmp, true);
        $A.enqueueAction(action);
    },

    // method to fetch leaf nodes data
    fetchDistributors: function (cmp) {
        const action = cmp.get('c.getDistributors');
        const country = cmp.get('v.country');
    	const state = cmp.get('v.state');
    	const region = cmp.get('v.region');
        action.setParams({
            stateId: cmp.get('v.hierarchicalMap')['states'][country + '-' + region + '-' + state ],
        });

        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                var value = response.getReturnValue();
                if (Array.isArray(value) && value.length == 0) {
                    this.showToast('Information', `No record found for distributor allocation.`, 'info');
                } else {
                    cmp.set('v.distributorList', value);
                    cmp.set(
                        'v.distributors',
                        Array.from(
                            new Set(
                                value.map(
                                    (item) =>
                                        item.Brand_Country_Region_State_Allocation__r.Name + '~' + item.Account__r.Name
                                )
                            )
                        )
                    );
                }
            }
            this.toggleLoader(cmp, false);
        });
        this.toggleLoader(cmp, true);
        $A.enqueueAction(action);
    },

    // method to create allocation record
    createRecord: function (cmp) {
        const action = cmp.get(`c.transfer${cmp.get('v.move')}`);
    	const country = cmp.get('v.country');
    	const state = cmp.get('v.state');
    	const region = cmp.get('v.region');
    	const newRegion = cmp.get('v.transferData.newRegion');
        const isDistributorMove = cmp.get('v.move') == 'Distributor';
        const hierarchicalMap = cmp.get('v.hierarchicalMap');
        let countryId = hierarchicalMap['countries'][country];
        let oldRecordId = isDistributorMove
            ? cmp.get('v.transferData.oldDistributor')
            : hierarchicalMap['states'][country + '-' + region + '-' + cmp.get('v.transferData.oldState')];
    	let oldParentKey = isDistributorMove 
    		? country + '-' + region + '-' + state 
    		: country + '-' + region;
        let oldParentId = isDistributorMove ? hierarchicalMap['states'][oldParentKey] : hierarchicalMap['regions'][oldParentKey];
        let newParentId = isDistributorMove ? hierarchicalMap['states'][country + '-' + newRegion + '-' + cmp.get('v.transferData.newState')] : hierarchicalMap['regions'][country + '-' + cmp.get('v.transferData.newRegion')];
        action.setParams({
            countryId: countryId,
            oldParentId: oldParentId,
            oldRecordId: oldRecordId,
            newParentId: newParentId,
            transferType: cmp.get('v.move')
        });
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state == 'SUCCESS') {
                this.showToast('Success!', `${cmp.get('v.move')} has been transferred successfully.`, 'success');
                this.setDefaults(cmp);
            } else if (state == 'ERROR') {
            	console.log(response.getError());
                this.showToast('Error!', response.getError()[0].message, 'error');
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
        cmp.set('v.move', '');
    },

    handleCountryChange: function (cmp) {
        cmp.set('v.region', '');
        let value = cmp.get('v.country');
        if (value) {
            let data = Object.keys(cmp.get('v.hierarchicalMap')['hierarchy'][value]);
            cmp.set('v.regions', data);
        } else {
            cmp.set('v.regions', []);
        }
    },

    handleRegionChange: function (cmp) {
        cmp.set('v.state', '');
        cmp.set('v.transferData.oldDistributor', '');
        cmp.set('v.transferData.newDistributor', '');
        cmp.set('v.transferData.newRegion', '');
        cmp.set('v.transferData.newState', '');
        cmp.set('v.states', []);
        cmp.set('v.destinationRegions', []);
        cmp.set('v.destinationStates', []);
        let value = cmp.get('v.region');
        if (value) {
            let hierarchy = cmp.get('v.hierarchicalMap')['hierarchy'][cmp.get('v.country')];
            cmp.set('v.states', hierarchy[value]);
        }
    },

    handleStateChange: function (cmp) {
        let isDistributorMove = cmp.get('v.move') == 'Distributor';
        let value = isDistributorMove ? cmp.get('v.state') : cmp.get('v.transferData.oldState');
        cmp.set('v.transferData.newRegion', '');
        cmp.set('v.transferData.newState', '');
        cmp.set('v.destinationStates', []);
        if (value) {
            if (isDistributorMove) {
                this.fetchDistributors(cmp);
                cmp.set('v.destinationRegions', cmp.get('v.regions'));
            } else {
                let region = cmp.get('v.region');
                let regions = cmp.get('v.regions');
                let destinationRegions = regions.filter(function (item) {
                    return item != region;
                });
                if (destinationRegions.length > 0) {
                    cmp.set('v.destinationRegions', destinationRegions);
                } else {
                    this.showToast(
                        'Information',
                        `There is only one record for region. So there is no scope of transfer.`,
                        'info'
                    );
                }
            }
        }
    },

    handleDestinationRegionChange: function (cmp) {
        var value = cmp.get('v.transferData.newRegion');
        if (value) {
            let state = cmp.get('v.state');
            let states = cmp.get('v.states');
            if (value == cmp.get('v.region')) {
                let destinationStates = states.filter(function (item) {
                    return item != state;
                });
                if (destinationStates.length > 0) {
                    cmp.set('v.destinationStates', destinationStates);
                } else {
                    this.showToast(
                        'Information',
                        `There is only one record for state. So there is no scope of transfer.`,
                        'info'
                    );
                }
            } else {
                cmp.set('v.destinationStates', cmp.get('v.hierarchicalMap')['hierarchy'][cmp.get('v.country')][value]);
            }
        } else {
            cmp.set('v.destinationStates', []);
        }
    },
});