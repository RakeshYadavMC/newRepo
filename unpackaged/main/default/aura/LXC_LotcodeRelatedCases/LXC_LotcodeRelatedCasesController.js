({
    //init method to set table structure
    init: function (cmp, event, helper) {
        cmp.set('v.columns', [
            {
                label: 'Case Number',
                fieldName: 'caseLink',
                type: 'url',
                typeAttributes: { label: { fieldName: 'CaseNumber' }, target: '_blank' },
                hideDefaultActions: true,
            },
            { label: 'Contact Name', fieldName: 'ContactName', type:'text', hideDefaultActions: true },
            { label: 'Lotcode', fieldName: 'Lot_Code__c', type: 'text', hideDefaultActions: true },
        ]);
    },
});