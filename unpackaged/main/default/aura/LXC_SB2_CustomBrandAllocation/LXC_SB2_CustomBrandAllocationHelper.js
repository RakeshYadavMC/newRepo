({
    validateNewBrandAllocation : function(component, event, helper) {
        const action = component.get('c.validateBrandAllocation');
        action.setParams({
            newBrandAllocation: component.get('v.newBrandAllocation')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                console.log(response.getReturnValue());
                if(response.getReturnValue() != null) { 
                    if(response.getReturnValue().status == true){
                        this.createNewBrandAllocation(component, event, helper);
                    } else {
                        var listOfkeys = [];
                        for (var key in response.getReturnValue().responseMap) {
                            listOfkeys.push(key);
                        }
                        component.set("v.lstExistingBrandAlloc", listOfkeys);
                        component.set("v.openModal", true);
                    }
                } else {
                    this.createNewBrandAllocation(component, event, helper);
                }                
            } else if (state == 'ERROR') {
                let errors = response.getError();
                let errorMessages = []; 
                if(errors && Array.isArray(errors) && errors.length > 0) {
                    errors.forEach((error, index) => {
                        errorMessages.push(error.message);
                        console.log(errorMessages);
                        if(index == errors.length - 1) {
                        this.toggleErrors(component, errorMessages, true);
                    }
                    });
                    } else {
                        this.showToast('Error!', 'The is an error while creating the record.', 'error');
                    }
                    }
                        this.toggleLoader(component, false);
                    });
                        this.toggleErrors(component, [], false);
                        this.toggleLoader(component, true);
                        $A.enqueueAction(action);
                        
                    },
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
                        createNewBrandAllocation : function(component, event, helper) {
                            const action = component.get('c.insertBrandAllocation');
                            action.setParams({
                                newBrandAllocation: component.get('v.newBrandAllocation')
                            });
                            action.setCallback(this, function(response) {
                                var state = response.getState();
                                if (state == 'SUCCESS') {
                                    this.showToast('Success!', 'The record has been created successfully.', 'success');
                                    this.closeTab(component);
                                    this.navigateToSObject(response.getReturnValue().Id);
                                } else if (state == 'ERROR') {
                                    let errors = response.getError();
                                    let errorMessages = []; 
                                    if(errors && Array.isArray(errors) && errors.length > 0) {
                                        errors.forEach((error, index) => {
                                            errorMessages.push(error.message);
                                            console.log(errorMessages);
                                            if(index == errors.length - 1) {
                                            this.toggleErrors(component, errorMessages, true);
                                        }
                                        });
                                        } else {
                                            this.showToast('Error!', 'The is an error while creating the record.', 'error');
                                        }
                                        }
                                            this.toggleLoader(component, false);
                                        });
                                            this.toggleErrors(component, [], false);
                                            this.toggleLoader(component, true);
                                            $A.enqueueAction(action);
                                            
                                        },
                                            updatePreviousAllocation : function(component, event, helper){
                                                const action = component.get('c.deactivateBrandAllocation');
                                                action.setParams({
                                                    lstBrandAlloc: component.get('v.lstExistingBrandAlloc'),
                                                    status:'overlap'
                                                });
                                                action.setCallback(this, function(response) {
                                                    var state = response.getState();
                                                    if (state == 'SUCCESS') {
                                                        this.createNewBrandAllocation(component, event, helper);
                                                    } else if (state == 'ERROR') {
                                                        let errors = response.getError();
                                                        let errorMessages = []; 
                                                        if(errors && Array.isArray(errors) && errors.length > 0) {
                                                            errors.forEach((error, index) => {
                                                                errorMessages.push(error.message);
                                                                console.log(errorMessages);
                                                                if(index == errors.length - 1) {
                                                                this.toggleErrors(component, errorMessages, true);
                                                            }
                                                            });
                                                            } else {
                                                                this.showToast('Error!', 'The is an error while creating the record.', 'error');
                                                            }
                                                            }
                                                                this.toggleLoader(component, false);
                                                            });
                                                                
                                                                $A.enqueueAction(action);
                                                                
                                                            },
                                                                createBrandAllocation : function(component, event, helper) {
                                                                    const action = component.get('c.insertCurrentBrandAllocation');
                                                                    action.setParams({
                                                                        newBrandAllocation: component.get('v.newBrandAllocation')
                                                                    });
                                                                    action.setCallback(this, function(response) {
                                                                        var state = response.getState();
                                                                        if (state == 'SUCCESS') {
                                                                            this.showToast('Success!', 'The record has been created successfully.', 'success');
                                                                            this.closeTab(component);
                                                                            this.navigateToSObject(response.getReturnValue().Id);
                                                                        } else if (state == 'ERROR') {
                                                                            let errors = response.getError();
                                                                            let errorMessages = []; 
                                                                            if(errors && Array.isArray(errors) && errors.length > 0) {
                                                                                errors.forEach((error, index) => {
                                                                                    errorMessages.push(error.message);
                                                                                    console.log(errorMessages);
                                                                                    if(index == errors.length - 1) {
                                                                                    this.toggleErrors(component, errorMessages, true);
                                                                                }
                                                                                });
                                                                                } else {
                                                                                    this.showToast('Error!', 'The is an error while creating the record.', 'error');
                                                                                }
                                                                                }
                                                                                    this.toggleLoader(component, false);
                                                                                });
                                                                                    this.toggleErrors(component, [], false);
                                                                                    this.toggleLoader(component, true);
                                                                                    $A.enqueueAction(action);
                                                                                    
                                                                                }
                                                                                    
                                                                                })