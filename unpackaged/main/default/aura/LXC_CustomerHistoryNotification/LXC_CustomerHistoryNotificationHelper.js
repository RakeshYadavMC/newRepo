({
    //method to fetch warning message
    isSpammer: function(cmp) {
        const action = cmp.get('c.getWarningMessage');
        action.setParams({
            caseId: cmp.get('v.recordId'),
            email: cmp.get('v.caseRecord.Contact.Email'),
            country: cmp.get('v.caseRecord.Contact.MailingCountry'),
            state: cmp.get('v.caseRecord.Contact.MailingState'),
            city: cmp.get('v.caseRecord.Contact.MailingCity'),
            postalCode: cmp.get('v.caseRecord.Contact.MailingPostalCode'),
            street: cmp.get('v.caseRecord.Contact.MailingStreet'),
            createdDate: cmp.get('v.caseRecord.CreatedDate')
        });
        action.setCallback(this, function(response) {
            var returnValue = response.getReturnValue();
            cmp.set('v.warningMessage', returnValue);
        });
        $A.enqueueAction(action);
    }
});