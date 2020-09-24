({
    
    //init method to set table structure
    init: function(cmp, event, helper) {
        cmp.set('v.columns', [
            { label: 'Case Number', fieldName: 'caseLink', type: 'url', typeAttributes: {label: { fieldName: 'CaseNumber' }, target: '_blank'} }, 
            { label: 'Status', fieldName: 'Status', type: 'text' },
            { label: 'Brand', fieldName: 'Brand__c', type: 'text' }
        ]);
        
    },
    
    //method to be called when record is loaded
    handleRecordUpdated: function(cmp, event, helper){
        var eventParams = event.getParams();
        if(eventParams.changeType === 'LOADED') {
            helper.fetchData(cmp);
        }
    }
});