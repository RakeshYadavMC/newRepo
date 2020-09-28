({
    //method to fetch warning message
    isSpammer: function(cmp) {
        const getWarningMessage = cmp.get('c.getWarningMessage');
        getWarningMessage.setParams({
            caseId: cmp.get('v.recordId'),
            email: cmp.get('v.caseRecord.Contact.Email'),
            country: cmp.get('v.caseRecord.Contact.MailingCountry'),
            state: cmp.get('v.caseRecord.Contact.MailingState'),
            city: cmp.get('v.caseRecord.Contact.MailingCity'),
            postalCode: cmp.get('v.caseRecord.Contact.MailingPostalCode'),
            street: cmp.get('v.caseRecord.Contact.MailingStreet'),
            createdDate: cmp.get('v.caseRecord.CreatedDate')
        });
        getWarningMessage.setCallback(this, function(response) {
            var returnValue = response.getReturnValue();
            cmp.set('v.warningMessage', returnValue);
        });

        const getLotcodeCases = cmp.get('c.getLotcodeCases');
        const lotCode = cmp.get('v.caseRecord.Lot_Code__c');
        getLotcodeCases.setParams({
            caseId: cmp.get('v.recordId'),
            country: cmp.get('v.caseRecord.Contact.MailingCountry'),
            lotCode: lotCode && lotCode.length > 4 ? lotCode.slice(0, 4) : null
        })
        getLotcodeCases.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS') {
                var returnValue = response.getReturnValue();
                if($A.util.isArray(returnValue) && returnValue.length) {
                    returnValue.forEach(function(record) {
                        record.caseLink = '/lightning/r/' + record.Id + '/view';
                        record.ContactName = record.Account.Name;
                    });
                    cmp.set('v.data', returnValue);
                }
            }
        });
        $A.enqueueAction(getWarningMessage);
        $A.enqueueAction(getLotcodeCases);
    },

});