({
    // method to called on init
    loadOptions: function (cmp, evt, helper) {
        var workspaceAPI = cmp.find('workspace');
        workspaceAPI
            .getFocusedTabInfo()
            .then(function (response) {
                console.log(JSON.stringify(response, null, 4));
                //To handle creating record from related lists
                if (
                    (response.hasOwnProperty('isSubtab') && response['isSubtab']) ||
                    (response.hasOwnProperty('subtabs') && response['subtabs'].length > 0)
                ) {
                    let parentAllocationId = response['recordId']
                        ? response['recordId']
                        : response.pageReference.state.ws.split('/')[4];
                    cmp.set('v.parentAllocationId', parentAllocationId);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        var headerTitle = cmp.get('v.sObjectName').slice(0, -3).split('_').join(' ');
        cmp.set('v.objectName', headerTitle.split(' ').join(''));
        cmp.set('v.headerTitle', 'New ' + helper.HEADER_TITLE[cmp.get('v.sObjectName')]);
    },

    onTabClosed: function (cmp, evt, helper) {
        // let allocationValue = helper.PARENT_LOOKUP[cmp.get('v.sObjectName')][0];
        // window.setTimeout(
        //     $A.getCallback(function () {
        //         cmp.set(`v.${allocationValue}`, '');
        //         cmp.set('v.parentAllocationId', '');
        //     }),
        //     500
        // );
    },

    // Submit button handler
    handleSubmit: function (cmp, event, helper) {
        helper.validateForm(cmp, function (value) {
            if (value) {
                helper.createRecord(cmp, cmp.get('v.objectName'));
            }
        });
    },

    // Cancel button handler
    handleCancel: function (cmp, evt, helper) {
        helper.closeTab(cmp);
    },

    // change handler for Is Leaf Node
    handleChange: function (cmp, event, helper) {
        helper.handleChange(cmp);
    },

    // method to prevent user from pasting
    handlePaste: function (cmp, evt, helper) {
        evt.preventDefault();
    },

    // change handler for Brand Allocation
    brandAllocationValueChange: function (cmp, evt, helper) {
        helper.handleBrandAllocationValueChange(cmp);
    },

    // change handler for Country
    countryValueChange: function (cmp, evt, helper) {
        helper.handleCountryValueChange(cmp);
    },

    // change handler for Brand Country Allocation
    brandCountryAllocationValueChange: function (cmp, evt, helper) {
        helper.handleBrandCountryAllocationValueChange(cmp);
    },

    // change handler for Region
    regionValueChange: function (cmp, evt, helper) {
        helper.handleRegionValueChange(cmp);
    },

    // change handler for Brand Country Region Allocation
    brandCountryRegionAllocationValueChange: function (cmp, evt, helper) {
        helper.handleBrandCountryRegionAllocationValueChange(cmp);
    },

    // change handler for State
    stateValueChange: function (cmp, evt, helper) {
        helper.handleStateValueChange(cmp);
    },

    // change handler for Brand Country Region State Allocation
    brandCountryRegionStateAllocationValueChange: function (cmp, evt, helper) {
        helper.handleBrandCountryRegionStateAllocationValueChange(cmp);
    },

    // change handler for Account
    accountValueChange: function (cmp, evt, helper) {
        helper.handleAccountValueChange(cmp);
    },

    // this method automatic call by aura:waiting event
    showSpinner: function (component, event, helper) {
        // make Spinner attribute true for display loading spinner
        component.set('v.Spinner', true);
    },

    // this method automatic call by aura:doneWaiting event
    hideSpinner: function (component, event, helper) {
        // make Spinner attribute to false for hide loading spinner
        component.set('v.Spinner', false);
    }
});