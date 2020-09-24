({
    //method to load all the required data
    loadOptions: function(component, event, helper) {
        //setting up reCaptchaOrigin
        component.set('v.reCaptchaOrigin', window.location.origin);
        var urlParameter = decodeURIComponent(window.location.search.substring(1).split('=')[1]);
        //getting url parameter
        component.set('v.newCase.Brand__c', urlParameter.indexOf('+') == -1 ? urlParameter : urlParameter.split('+').join(' '));
        var action = component.get('c.getPickListValues');
        var brand = component.get('v.newCase.Brand__c');
        action.setParams({ brand: brand });
        action.setCallback(this, function(response) {
            helper.prepareData(component, response.getReturnValue(), brand);
        });
        $A.enqueueAction(action);

        window.addEventListener(
            'message',
            function(event) {
                var index = component.get('v.currentPanel');
                
                if (event.data.name == 'reCaptchaToken') {
                    component.set('v.errorMessage', '');
                    component.set('v.reCaptchaToken', !!event.data.payload ? event.data.payload : '');
                }

                if (event.data.captchaVisible) {
                    var captchEl = document.getElementById('iFrame');
                    if (event.data.captchaVisible === 'visible') {
                        captchEl.classList.add('reCaptchaBig');
                        captchEl.classList.remove('reCaptchaSmall');
                    } else {
                        captchEl.classList.remove('reCaptchaBig');
                        captchEl.classList.add('reCaptchaSmall');
                    }
                    helper.adjustHeight(index);
                }
                component.set('v.isContactUsOpen', true);
            },
            false
        );
    },
    
    //method to call on how can we help onchange event & it sets showAdditionalInfo & productVisiblity attribute
    setHelpOptions: function(component, event, helper) {
        var howCanIHelp = event.getSource().get('v.value');
        howCanIHelp.toUpperCase() == 'Product or Packaging issue'.toUpperCase()
            ? component.set('v.showAdditionalInfo', true)
            : component.set('v.showAdditionalInfo', false);
        component.set('v.newCase.AdditionalInformation__c', '');
        component.set('v.additionalInformationOptions', component.get('v.additionalInformationMap')[howCanIHelp]);
        helper.setProductVisibility(component, howCanIHelp);
    },
    
    //method to submit the case
    submitCase: function(component, event, helper) {
        var acc = component.get('v.newAccount');
        //Delete object keys which are empty so that while updating existing account it won't fill with empty value
        Object.keys(acc).forEach(i => acc[i] == '' && delete acc[i]);
        helper.accObj = acc;
        var index = component.get('v.currentPanel');
        if (index < component.get('v.totalPanels') - 1 && component.get('v.showAdditionalInfo')) {
            ++index;

            if (!helper.validateForm(component, index)) {
                helper.showToast('Error!', 'Please review the errors.', 'error');
                return;
            }

            if (index == 2 && !component.get('v.reCaptchaToken')) {
                component.set('v.errorMessage', 'You need to verify reCAPTCHA.');
                helper.showToast('Error!', 'Please verify reCaptcha.', 'error');
                return;
            }

            // Initial Case Insert (Complaint)
            if (index == component.get('v.totalPanels') - 1) {
                component.set('v.currentStep', index + 1 + '');
                component.set('v.currentPanel', index);
                helper.createNewCase(component, component.get('v.caseId'), true, function() {
                    helper.changeFrame(component, index);
                    window.parent.postMessage('scrollTop', '*');
                    document.getElementById('iFrame').contentWindow.postMessage('resetReCaptcha', '*');
                });
            } else {
                component.set('v.currentStep', index + 1 + '');
                component.set('v.currentPanel', index);
                helper.changeFrame(component, index);
                component.set('v.errorMessage', '');
                window.parent.postMessage('scrollTop', '*');
            }
        } else if (!component.get('v.showAdditionalInfo')) {
            // Inquiry Creation
            if (!helper.validateForm(component, index + 1)) {
                helper.showToast('Error!', 'Please review the errors.', 'error');
                return;
            }
            if (!component.get('v.reCaptchaToken')) {
                component.set('v.errorMessage', 'You need to verify reCAPTCHA.');
                helper.showToast('Error!', 'Please verify reCaptcha.', 'error');
                return;
            }
            helper.createNewCase(component, null, false);
            window.parent.postMessage('scrollTop', '*');
        } else {
            helper.updateCase(component, component.get('v.caseId'));
            window.parent.postMessage('scrollTop', '*');
        }
    },
    
    //method to set lotCode to true so that lot code popup can open
    openLotCode: function(component, event, helper) {
        component.set('v.lotCode', true);
    },
    
	//method to set lotCode to false so that lot code popup can close    
    closeLotCode: function(component, event, helper) {
        component.set('v.lotCode', false);
    },
    
    //handler method to be called after file upload finish
    handleUploadFinished: function(component, event) {
        // Get the list of uploaded files
        var uploadedFiles = event.getParam('files');
        //setting uploaded files names
        if (typeof component.get('v.fileName')[0] === 'string') {
            component.set('v.fileName', uploadedFiles);
        } else {
            var files = component.get('v.fileName');
            component.set('v.fileName', [...files, ...uploadedFiles]);
        }
    },
    
    //method to go to previous page in wizard layout
    previousPage: function(component, event, helper) {
        var index = component.get('v.currentPanel');
        component.set('v.currentPanel', --index);
        component.set('v.currentStep', index + 1 + '');
        helper.changeFrame(component, index);
        window.parent.postMessage('scrollTop', '*');
    },
    
    //method to perform validation on confirm email address field
    confirmEmailAddress: function(component, event, helper) {
        var eventSource = event.getSource();
        var email = component.get('v.newAccount.PersonEmail');
        var confirmEmail = eventSource.get('v.value');
        if (!confirmEmail) {
            eventSource.setCustomValidity('Confirm Email must not be empty.');
        } else if (eventSource.get('v.validity').typeMismatch) {
            eventSource.setCustomValidity('You have entered an invalid format.');
        } else if (confirmEmail.toUpperCase() !== email.toUpperCase()) {
            eventSource.setCustomValidity('Confirm Email must be same.');
        } else {
            eventSource.setCustomValidity('');
        }
        eventSource.showHelpMessageIfInvalid();
    },
    
    //method to hide/show lot code input field
    setLotCode: function(component, event, helper) {
        var value = event.getSource().get('v.value');
        value.toUpperCase() == 'I no longer have the bottle'.toUpperCase()
            ? component.set('v.isLotCodeVisible', false)
            : component.set('v.isLotCodeVisible', true);
    },
    
    //method to call on Additional Information onchage event
    additionalInformationChange: function(component, event, helper) {
        var additionalInformation = event.getSource().get('v.value');
        helper.setProductVisibility(component, component.get('v.newCase.How_can_we_help__c'), additionalInformation);
    }
});