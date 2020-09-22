({
	//method to hide/show loading icon
    toggleLoader: function(component, isVisible) {
        component.set('v.ownerChanged', isVisible);
    }
})