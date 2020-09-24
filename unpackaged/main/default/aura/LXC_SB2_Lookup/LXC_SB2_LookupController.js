({
    init: function (component, event, helper) {
        helper.idIndexMap = {};
        helper.cachedSearches = {};
        if(!component.get('v.fieldLabel')) {
            helper.getFieldLabel(component);
        }
        if (component.get('v.value') == null || component.get('v.value') == "") {
            helper.search(component, null);
        } else {
            helper.fetchRecordById(component);
        }
    },
    showResults: function(component) {
        if(!component.get('v.readonly')){
            component.set('v.showResults', true);
        }
    },
    hideResults: function(component) {
        if(!component.get('v.readonly')){
            window.setTimeout($A.getCallback(function() {
                component.set('v.showResults', false);
            }), 200);
        }
    },
    recordSelect: function(component, event) {
        let recordList = component.get('v.recordList');
        component.set('v.value', event.currentTarget.id);
        component.set('v.showResults', false);
        let updateSelectedOptionEvent = component.getEvent("updateSelectedOptionEvent");
        let param = {'value':component.get('v.value'),
                     'parentIndex':component.get('v.parentIndex')};
        updateSelectedOptionEvent.setParams({"context":JSON.stringify(param)});
        updateSelectedOptionEvent.fire();         
    },
    unselectRecord: function(component) {
        component.set('v.selectedValue', null);
        component.set('v.value', null);
        let updateOptionUnselectEvent = component.getEvent("updateOptionUnselectEvent");
        updateOptionUnselectEvent.setParams({"context": component.get('v.parentIndex')});
        updateOptionUnselectEvent.fire();
    },
    fetchRecordInformation: function(component, event, helper) {
        let value = component.get('v.value');
        if (typeof value == 'object' || typeof value == 'undefined' || value == null) {
            return;
        }
        if (typeof helper.idIndexMap[value] != 'undefined') {
            component.set('v.selectedValue', helper.idIndexMap[value]);
        } else {
            component.set('v.isLoading', true);
            helper.fetchRecordById(component);
        }
    },
    search: function(component, event, helper) {
        if(!component.get('v.readonly')){
            component.set('v.isLoading', false);
            helper.search(component, event.getSource().get('v.value'));
        }
    }
})