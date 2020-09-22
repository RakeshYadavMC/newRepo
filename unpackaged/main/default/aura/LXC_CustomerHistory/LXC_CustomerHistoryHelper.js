({
    //method to fetch data
    fetchData: function(cmp) {
        const action = cmp.get('c.getCases');
        action.setParams({ 
            caseId: cmp.get('v.recordId'),
            email: cmp.get('v.caseRecord.Contact.Email'),
            country: cmp.get('v.caseRecord.Contact.MailingCountry'),
            state: cmp.get('v.caseRecord.Contact.MailingState'),
            city: cmp.get('v.caseRecord.Contact.MailingCity'),
            postalCode: cmp.get('v.caseRecord.Contact.MailingPostalCode'),
            street: cmp.get('v.caseRecord.Contact.MailingStreet')
        });
        action.setCallback(this, function(response) { 
            var returnValue = response.getReturnValue();
            returnValue.forEach(function(record) {
                record.caseLink = '/lightning/r/' + record.Id + '/view';
            });
            cmp.set('v.data', returnValue);
        });
        $A.enqueueAction(action);
    }
});