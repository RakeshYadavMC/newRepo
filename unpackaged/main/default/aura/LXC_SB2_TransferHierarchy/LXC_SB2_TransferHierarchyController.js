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
        helper.fetchData(cmp);
    },

    // change handler for move
    moveChange: function (cmp, evt, helper) {
        cmp.set('v.country', '');
    },

    // change handler for country
    countryChange: function (cmp, evt, helper) {
        helper.handleCountryChange(cmp);
    },

    // change handler for region
    regionChange: function(cmp, evt, helper) {
        helper.handleRegionChange(cmp);
    },

    // change handler for state
    stateChange: function(cmp, evt, helper) {
        helper.handleStateChange(cmp);
    },
    
    // change handler for distributor
    distributorChange: function(cmp, evt, helper) {
        //helper.handleDistributorChange(cmp);
    },

    destinationRegionChange: function(cmp, evt, helper) {
        helper.handleDestinationRegionChange(cmp);
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