({
	doInit: function(component, event, helper) {
        helper.createTable(component,event,helper);
		helper.getObjectRecords(component,event,helper);
	},
    showSpinner: function(component, event, helper) {
        component.set("v.spinnerFlag", true); 
    },     
    hideSpinner : function(component,event,helper){
        component.set("v.spinnerFlag", false);
    },
    handleKeyUp : function (component, event, helper) {
        if (event.which == 13){
            helper.getObjectRecords(component,event,helper);
        }
    }, 
    handleBrandChange : function (component, event, helper) {
        helper.getObjectRecords(component,event,helper);
    },
    handleToggleChange : function (component, event, helper){
        var checkCmp = component.find("chkbox").get("v.value");
        console.log('Thuis 1::',checkCmp);
        component.set("v.toggleCompleteIncomplete",checkCmp);
        helper.getObjectRecords(component,event,helper);
    },
    navigation: function(component, event, helper) {
        var sObjectList = component.get("v.totalRecordList");
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.noOfRecordsPerPage");
        var navButton = event.getSource().get("v.name");
        if (navButton == 'next') {
            component.set("v.currentPage", component.get("v.currentPage") + 1);
            helper.next(component, event, helper, sObjectList, end, start, pageSize);
        }
        else if (navButton == 'prev') {
            component.set("v.currentPage", component.get("v.currentPage") - 1);
            helper.previous(component, event, helper, sObjectList, end, start, pageSize);
        }
    }
})