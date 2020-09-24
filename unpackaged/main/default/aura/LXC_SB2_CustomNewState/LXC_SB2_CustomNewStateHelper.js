({
    // method for server call to creat state record
    createRecord: function (cmp, objectName) {
        var action = cmp.get(`c.createState`);
        action.setParams({
            state: cmp.get('v.newState'),
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
    toggleLoader: function (cmp, isLoading) {
        cmp.set('v.isLoading', isLoading);
    },

    // method to validate the form
    validateForm: function (cmp, callback) {
        let stateObject = cmp.get(`v.newState`);
        let objectArray = Object.entries(stateObject);
        let objectArrayLength = objectArray.length;
        let errors = [];
        this.toggleErrors(cmp, errors, false);
        objectArray.forEach(([key, value], index) => {
            if (!value) {
                let fieldName = key.indexOf('_') > -1 ? key.slice(0, -3) : key;
                let errorFieldName = fieldName.indexOf('_') > -1 ? fieldName.replace('_', ' ') : fieldName;
                if(key == 'Region__c') {
                    if(cmp.get('v.countryValue')) {
                        errors.push(errorFieldName + ' cannot be empty.');
                    }
                } else {
                    errors.push(errorFieldName + ' cannot be empty.');
                }
            }
            if(key == 'Alias__c' && value) {
                if(value.length < 2) {
                    errors.push('Please provide at least 2 character for Alias.')
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
    },
});