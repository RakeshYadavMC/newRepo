({
    // method to be called on init
    init: function (cmp, evt, helper) {
        var workspaceAPI = cmp.find('workspace');
        workspaceAPI
            .getFocusedTabInfo()
            .then(function (response) {
                if(!$A.util.isEmpty(response)) {
                    var navigationItemAPI = cmp.find("navigationItemAPI");
                    navigationItemAPI.refreshNavigationItem().then(function(response) {
                        console.log(response);
                    })
                    .catch(function(error) {
                        console.log(error);
                    }); 
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        let pageReference = cmp.get('v.pageReference');
        let title = pageReference.attributes.apiName.replace('_', ' ');
        cmp.set('v.title', title);
        cmp.set('v.manageAllocation.Change_Type__c', title.split(' ')[0]);
        helper.fetchData(cmp);
    },

    // change handler for brand allocation
    brandAllocationChange: function (cmp, evt, helper) {
        var value = cmp.get('v.brandAllocation');
        if (value) {
            cmp.set('v.brands', Object.keys(value['brands']));
        }
    },

    // change handler for brand
    brandChange: function (cmp, evt, helper) {
        console.log('brand');
        console.log('old: ' + cmp.get("v.brand"));
        
        helper.handleBrandChange(cmp);
    },

    // change handler for programTypeAndInterval
    programTypeAndIntervalChange: function (cmp, evt, helper) {
        console.log('programType');
        helper.handleProgramTypeAndIntervalChange(cmp);
    },

    // change handler for country
    countryChange: function (cmp, evt, helper) {
        helper.handleCountryChange(cmp);
    },

    // change handler for from attribute
    fromChange: function (cmp, evt, helper) {
        helper.handleFromChange(cmp);
    },

    // change handler for fromAllocationValue attribute
    fromAllocationValueChange: function (cmp, evt, helper) {
        helper.handleFromAllocationValueChange(cmp);
    },

    // change handler for to attribute
    toChange: function (cmp, evt, helper) {
        helper.handleToChange(cmp);
    },

    // change handler for toAllocationValue attribute
    toAllocationValueChange: function (cmp, evt, helper) {
        helper.handleToAllocationValueChange(cmp);
    },

    // method to handle submit button click
    handleSubmit: function (cmp, evt, helper) {
        if (helper.validateForm(cmp)) {
            helper.createRecord(cmp);
        } else {
            helper.showToast('Error!', 'Please review the errors.', 'error');
        }
    },
});