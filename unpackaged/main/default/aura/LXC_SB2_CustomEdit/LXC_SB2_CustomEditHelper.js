({
    // Method to save record
    saveRecord: function (cmp) {
        var action = cmp.get('c.updateDistributorAllocation');
        action.setParams({
            recordId: cmp.get('v.recordId'),
            allocation: cmp.get('v.allocation'),
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                this.closeQuickAction();
                $A.get('e.force:refreshView').fire();
                this.showToast('Success!', 'The record has been updated successfully.', 'success');
            } else if (state === 'ERROR') {
                self.showNotification(JSON.stringify(saveResult.error));
            } else {
                self.showNotification(JSON.stringify(saveResult.error));
            }
        });

        $A.enqueueAction(action);
    },

    // Method to close quick action
    closeQuickAction: function () {
        $A.get('e.force:closeQuickAction').fire();
    },

    // Method to show notification popup
    showNotification: function (cmp, message) {
        cmp.find('notifLib').showNotice({
            variant: 'error',
            header: 'Error!',
            message: 'Unfortunately, there was a problem updating the record.',
            closeCallback: function () {
                this.closeQuickAction();
            },
        });
    },

    // Method to show toast
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
    // Method to save record
    saveStateAlloc: function (cmp) {
        var action = cmp.get('c.updateStateAllocation');
        action.setParams({
            recordId: cmp.get('v.recordId'),
            allocation: cmp.get('v.allocation'),
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                this.closeQuickAction();
                $A.get('e.force:refreshView').fire();
                this.showToast('Success!', 'The record has been updated successfully.', 'success');
            } else if (state === 'ERROR') {
                self.showNotification(JSON.stringify(saveResult.error));
            } else {
                self.showNotification(JSON.stringify(saveResult.error));
            }
        });

        $A.enqueueAction(action);
    },
    // Method to save record
    saveRegionAlloc: function (cmp) {
        var action = cmp.get('c.updateRegionAllocation');
        action.setParams({
            recordId: cmp.get('v.recordId'),
            allocation: cmp.get('v.allocation'),
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                this.closeQuickAction();
                $A.get('e.force:refreshView').fire();
                this.showToast('Success!', 'The record has been updated successfully.', 'success');
            } else if (state === 'ERROR') {
                self.showNotification(JSON.stringify(saveResult.error));
            } else {
                self.showNotification(JSON.stringify(saveResult.error));
            }
        });

        $A.enqueueAction(action);
    },
    
    // Method to save record
    saveCountryAlloc: function (cmp) {
        var action = cmp.get('c.updateCountryAllocation');
        action.setParams({
            recordId: cmp.get('v.recordId'),
            allocation: cmp.get('v.allocation'),
        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state == 'SUCCESS') {
                this.closeQuickAction();
                $A.get('e.force:refreshView').fire();
                this.showToast('Success!', 'The record has been updated successfully.', 'success');
            } else if (state === 'ERROR') {
                
                self.showNotification(JSON.stringify(response.getReturnValue()));
            } else {
                self.showNotification(JSON.stringify(response.getReturnValue()));
            }
        });

        $A.enqueueAction(action);
    },
});