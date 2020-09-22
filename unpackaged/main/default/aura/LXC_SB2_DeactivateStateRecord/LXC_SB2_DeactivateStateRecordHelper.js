({
    saveRecord: function (cmp) {
        var action = cmp.get('c.deactivateRecord');
        action.setParams({
            recordId: cmp.get('v.recordId'),
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                this.closeQuickAction();
                this.showToast(
                    'Success!',
                    $A.get("$Label.c.SB2_Action_Success_Message"),
                    'success'
                );
                $A.get('e.force:refreshView').fire();
            } else if (state === 'ERROR') {
                this.closeQuickAction();
                this.showToast(
                    'Error!',
                    $A.get("$Label.c.SB2_Action_Error_Message"),
                    'error'
                );
            }
        });
        $A.enqueueAction(action);
    },
    showToast: function (title, message, type) {
        var toastEvent = $A.get('e.force:showToast');
        toastEvent.setParams({
            title: title,
            message: message,
            type: type,
            duration: 3000,
        });
        toastEvent.fire();
    },
    closeQuickAction: function () {
        $A.get('e.force:closeQuickAction').fire();
    },
});