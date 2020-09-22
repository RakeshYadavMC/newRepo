({

    init: function(component, event, helper) {
        var brand = component.get('v.brand');
        var isCurrentProgramAvailablePromise = helper.isCurrentProgramAvailable(component, event, helper);
        console.log('isCurrentProgramAvailablePromise::::',isCurrentProgramAvailablePromise);
        isCurrentProgramAvailablePromise.then(
            $A.getCallback(function(result) {
                if (brand == 'El Tesoro') {
                    component.set('v.isProgramAvailable', result['isActiveProgram']);
                }

                component.set('v.currentUserCountry', $A.get("$Locale.userLocaleCountry"));
                if ($A.get("$Locale.userLocaleCountry") != 'US') {
                    helper.buildApplication(component, event, helper);
                }
            })
        );
    },


    handleAccountChange: function(component, event, helper) {
        console.log('checking value');

        var accountRecord = component.get('v.accountRecord');
        var brand = component.get('v.brand');
        helper.resetAccountStatus(component, event, helper);
        if (helper.isEmpty(accountRecord)) {
            helper.hideQuestions(component, event, helper);
            component.set('v.accountId', '');
            component.set('v.premiseType', null);
            component.set('v.applicationSubmitted', false);
        } else {
            console.log('prem type', accountRecord.PremiseType__c);
            component.set('v.accountId', accountRecord.Id);
            component.set('v.premiseType', accountRecord.PremiseType__c);

            var checkAccountStatusPromise = helper.checkAccountStatus(component, event, helper);
            checkAccountStatusPromise.then(
                $A.getCallback(function(result) {
                    if (result['accountPendingApproval']) {
                        component.set('v.accountStatus', 'PENDING');
                    } else if (result['accountApproved']) {
                        component.set('v.accountStatus', 'APPROVED');
                        if (brand != 'Makers Mark') {
                            component.set('v.applicationSubmitted', true);
                        }

                        // skip application
                    } else {
                        component.set('v.accountStatus', 'NEW');
                        helper.buildApplication(component, event, helper);
                    }
                })
            );
        }
    },
    
    onDistributorAccountChange: function(component, event, helper) {
        helper.onDistributorAccountChange(component, event, helper);
    },
    
    onContactLookupChange: function(component, event, helper) {
        helper.onContactLookupChange(component, event, helper);
    },
    
    handleInputChange: function(component, event, helper) {
        var response = event.getParam('value');
        var auraId = event.getSource().getLocalId();
        console.log(response);
        console.log(typeof(response));
        console.log(auraId);
        helper.addQuestionToMap(component, event, helper, auraId, response);
    },

    handleCreateApplication: function(component, event, helper) {
        console.log('inside JS>>> handleCreateApplication');
        component.set('v.submitButtonDisabled', true);
        setTimeout(function() {
            component.set('v.submitButtonDisabled', false);
        }, 5000);
        
        var currentBrand = component.get('v.brand');
        var distributorAccount = component.get('v.distributorAccount');
        var distributorContact = component.get('v.distributorContact');
        
        /*if(((currentBrand == 'Makers Mark')||(currentBrand =='El Tesoro'))&&
           ((distributorAccount == null || distributorAccount == '' || distributorAccount == undefined)||
            (distributorContact == null || distributorContact == '' || distributorContact == undefined)))
        {
            if (distributorAccount == null || distributorAccount == '' || distributorAccount == undefined){
                helper.showToast('Missing Distributor Account information', 'Error', 'error');
            }           
            if (distributorContact == null || distributorContact == '' || distributorContact == undefined){
                helper.showToast('Missing Distributor Contact information', 'Error', 'error');
            } 
            return;
        }*/
        
        if(((currentBrand == 'Makers Mark')||(currentBrand =='El Tesoro'))&&
           (distributorAccount == null || distributorAccount == '' || distributorAccount == undefined))
        {         
            helper.showToast('Missing Distributor Account information', 'Error', 'error');          
            return;
        }
        
        var createApplicationPromise = helper.createApplication(component, event, helper);
        createApplicationPromise.then(
            $A.getCallback(function(result) {
                console.log(result);
                component.set('v.questionMap', result['appQuestions']);
                helper.showToast('Application Submitted!', 'Success', 'success');
                helper.moveToNextScreen(component, event, helper);

            }),
            $A.getCallback(function(error) {
                // Something went wrong
                helper.showToast('An Error Occured', 'Error', 'error');
            })
        )
    },

    handleNavigate: function(component, event, helper) {
        var navigate = component.get("v.navigateFlow");
        navigate(event.getParam("action"));
    },

    handleBuildApplication: function(component, event, helper) {
        helper.getQuestions(component, event, helper);
    },

    handleSendRequestForPreviouslyApprovedAccount: function(component, event, helper) {
        component.set('v.submitButtonDisabled', true);
        setTimeout(function() {
            component.set('v.submitButtonDisabled', false);
        }, 5000);
        
        var currentBrand = component.get('v.brand');
        var distributorAccount = component.get('v.distributorAccount');
        var distributorContact = component.get('v.distributorContact');
        
        /*if(((currentBrand == 'Makers Mark')||(currentBrand =='El Tesoro'))&&
           ((distributorAccount == null || distributorAccount == '' || distributorAccount == undefined)||
            (distributorContact == null || distributorContact == '' || distributorContact == undefined)))
        {
            if (distributorAccount == null || distributorAccount == '' || distributorAccount == undefined){
                helper.showToast('Missing Distributor Account information', 'Error', 'error');
            }           
            if (distributorContact == null || distributorContact == '' || distributorContact == undefined){
                helper.showToast('Missing Distributor Contact information', 'Error', 'error');
            } 
            return;
        }*/
        
        if(((currentBrand == 'Makers Mark')||(currentBrand =='El Tesoro'))&&
           (distributorAccount == null || distributorAccount == '' || distributorAccount == undefined))
        {         
            helper.showToast('Missing Distributor Account information', 'Error', 'error');          
            return;
        }
            
        var submitApplicationWithExistingResponsesPromise = helper.submitApplicationWithExistingResponses(component, event, helper);
        submitApplicationWithExistingResponsesPromise.then(
            $A.getCallback(function(result) {
                console.log(result);
                helper.showToast('Application Submitted, you will receive an email once your application has been reviewed.', 'Success', 'success');
                helper.moveToNextScreen(component, event, helper);

            }),
            $A.getCallback(function(error) {
                // Something went wrong
                helper.showToast('An Error Occured', 'Error', 'error');
            })
        )
    },
    handleNationalAccount:function(component, event, helper){
        var changeValue = event.getParam("value");
        //alert('=====selected==='+changeValue);
        component.set('v.NationalAccount',changeValue);
    }

})