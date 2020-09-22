({
    //method to be called when record is loaded
    handleRecordUpdated: function(cmp, event, helper){
        var eventParams = event.getParams();
        if(eventParams.changeType === 'LOADED') {
            helper.isSpammer(cmp);
        }
    }
})