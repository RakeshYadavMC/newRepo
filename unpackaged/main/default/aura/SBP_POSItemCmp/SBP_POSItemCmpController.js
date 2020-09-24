({
    init: function(component, event, helper) {
        helper.init(component, event, helper);
    },
    selectPosItem: function(component, event, helper) {
        helper.toggleButton(component, event, helper);
        helper.selectPosItem(component, event, helper, false);
    },
    handleButtonClick: function(component, event, helper) {
        helper.toggleButton(component, event, helper);
    },
    handleOptionChange: function(component, event, helper) {
        helper.handleOptionChange(component, event, helper);
    },
    handleMenuInsertTextChange: function(component, event, helper) {
        helper.selectPosItem(component, event, helper, true);
    },
    hanldeHidePOSItems : function(component,event, helper){
        component.set('v.optionVal', '');
    },
    handleApplicationEvent : function(component,event,helper){
        var message = event.getParam("LabeltextEventVal");
		//alert('====================message event=='+message);
        // set the handler attributes based on event data
        component.set("v.BottleTextval", message);
        //alert(component.get("v.BottleTextval"));
    }
    

})