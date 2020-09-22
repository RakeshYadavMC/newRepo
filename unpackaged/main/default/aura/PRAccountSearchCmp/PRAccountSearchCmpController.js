({
	init: function (component, event, helper) {
        helper.init(component, event, helper);
    },
	handleClearFilterValues: function (component, event, helper) {
        helper.clearFilterValues(component, event, helper);
        helper.clearSearchResults(component, event, helper);
    },
    handleKeyUp : function (component, event, helper) {
        if (event.which == 13){
            helper.search(component, event, helper);
        }
    },
    handleSearchBySOQLRecords: function (component, event, helper) {
        helper.search(component, event, helper);
    },
    handleRecordSelection: function (component, event, helper) {
        var row = event.getParam('row');

        component.set('v.selectedRecord', row);
        component.set('v.selectedRecordId', row['Id']);
        component.set('v.recordSelected', true);
        var cmpEvent = $A.get("e.c:PRVendorAccountSearchEvt");
        console.log("AccountId is:::",component.get('v.selectedRecordId'));
        cmpEvent.setParams({"AccountId" : component.get('v.selectedRecordId')});
        cmpEvent.setParams({"AccountRecord" : component.get('v.selectedRecord')});
        cmpEvent.fire(); 
    },
    onSearchTermChange: function (component, event, helper, attribute) {
        var search = component.get('v.searchTerm');
        console.log('inside onSearchTermChange:::',search);
        if(search==''||search==null){
            console.log('inside search null:::');
            helper.search(component, event, helper);
        }
        helper.filterCurrentListOfRecords(component, event, helper);
    },
})