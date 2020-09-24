({
    // method to called on init
    loadOptions: function (cmp, evt, helper) {
        var workspaceAPI = cmp.find('workspace');
        workspaceAPI
            .getFocusedTabInfo()
            .then(function (response) {
                var pageReference = response.hasOwnProperty('pageReference') ? response['pageReference'] : '';
                if (pageReference && pageReference.hasOwnProperty('attributes')) {
                    var attributes = pageReference['attributes'];
                    var state = pageReference['state'];
                    if (attributes.hasOwnProperty('recordId') && attributes['recordId']) {
                        if (attributes['objectApiName'] == 'Region__c') {
                            cmp.set('v.regionValue', attributes['recordId']);
                            cmp.set('v.isFromRelatedList', true);
                        } else if (attributes['objectApiName'] == 'Country__c') {
                            cmp.set('v.countryValue', attributes['recordId']);
                            cmp.set('v.isFromRelatedList', true);
                        }
                    } else if (state.hasOwnProperty('ws') && state['ws']) {
                        let url = state['ws'].split('/');
                        if (Array.isArray(url) && url.length > 5) {
                            if (url[3] == 'Region__c') {
                                cmp.set('v.regionValue', url[4]);
                                cmp.set('v.isFromRelatedList', true);
                            } else if (url[3] == 'Country__c') {
                                cmp.set('v.countryValue', url[4]);
                                cmp.set('v.isFromRelatedList', true);
                            }
                        }
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    },

    // change hanlder for country
    countrySelectedValueChange: function (cmp, evt, helper) {
        var value = cmp.get('v.countrySelectedValue');
        if (value) {
            cmp.set('v.regionFilter', [
                {
                    field: 'Country__c',
                    operator: '=',
                    value: `${value.Id}`
                }
            ]);
            cmp.set('v.newState.Country__c', value.Id);
        } else {
            cmp.set('v.countryValue', '');
            cmp.set('v.regionValue', '');
            cmp.set('v.newState.Country__c', '');
            cmp.set('v.newState.Region__c', '');
        }
    },

    // change hanlder for region
    regionSelectedValueChange: function (cmp, evt, helper) {
        var value  = cmp.get('v.regionSelectedValue');
        if(value) {
            let data = value.data.data ? value.data.data : value.data;
            cmp.set('v.countryValue', data.Country__c);
            cmp.set('v.newState.Country__c', data.Country__c);
            cmp.set('v.newState.Region__c', data.Id);
        } else {
            cmp.set('v.regionValue', '');
            cmp.set('v.newState.Region__c', '');
        }
    },

    // change hanlder for state manager
    stateManagerSelectedValueChange: function (cmp, evt, helper) {
        var value  = cmp.get('v.stateManagerSelectedValue');
        if(value) {
            cmp.set('v.newState.State_Manager__c', value.Id);
        }
    },

    // Cancel button handler
    handleCancel: function (cmp, evt, helper) {
        helper.closeTab(cmp);
    },

    // Submit button handler
    handleSubmit: function (cmp, event, helper) {
        helper.validateForm(cmp, function (value) {
            if (value) {
                helper.createRecord(cmp);
            }
        });
    },
});