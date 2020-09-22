({
    // method to called on init
    loadOptions: function (component, event, helper) {
        var recordId = component.get("v.recordId");
                var brandId = component.get('v.data.Brand__r.Id');
        var brandAllocId = component.get('v.data.Id');
                    component.set('v.brandAllocationFilter', [
                        {
                            field: 'Brand__c',
                            operator: '=',
                            value: `${brandId}`,
                        },
                        {
                        field: 'Status__c',
                        operator: '!=',
                        value: 'InActive',
                        },
                        {
                        field: 'Id',
                        operator: '!=',
                        value: `${brandAllocId}`,
                        },
                    ]);
        helper.checkIfHierarchyIsAvaiable(component, event, helper);
        
        
    },    
    showSpinner: function(component, event, helper) {
        component.set("v.Spinner", true); 
    },
    hideSpinner : function(component,event,helper){
        component.set("v.Spinner", false);
    },
    brandAllocationValueChange: function (cmp, evt, helper) {
        helper.handleBrandAllocationValueChange(cmp);
    },
    handleCancel: function (cmp, evt, helper) {
        helper.closeTab(cmp);
    },
    handleSubmit: function (component, event, helper) {
        if(component.get('v.hasError') || component.get('v.isAlredyHierarchy') || !(component.get('v.data.Is_Active__c'))){
            helper.closeTab(component);
        } else{
            helper.createRecord(component, event, helper);
        }
    },
})