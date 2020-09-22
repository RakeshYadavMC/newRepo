({
    closeQuickAction: function (cmp, evt, helper) {
        helper.closeQuickAction();
    },
    handleSubmit: function (cmp, evt, helper) {
        if (cmp.get('v.data').IsActive__c) {
            helper.saveRecord(cmp);
        } else {
            helper.closeQuickAction();
        }
    }
})