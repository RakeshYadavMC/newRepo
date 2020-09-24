({
	//method to hide/show loading icon
    toggleLoader: function(component, isVisible) {
        component.set('v.isEmailSent', isVisible);
    },
    
    //method to disabel send link button
    disableSendLinkButton: function(component, isDisable) {
        component.set('v.isButtonActive', isDisable);
    }
})