({
    //method to be called when record is loaded
    handleRecordUpdated: function(cmp, event, helper){
        var eventParams = event.getParams();
        if(eventParams.changeType === 'LOADED') {
            helper.isSpammer(cmp);
        }
    },
    handleLotCodeCases: function(cmp, evt, helper) {
        var modalBody;
        $A.createComponent("c:LXC_LotcodeRelatedCases", {data: cmp.get('v.data')},
           function(content, status) {
               if (status === "SUCCESS") {
                   modalBody = content;
                   cmp.find('overlayLib').showCustomModal({
                       header: "Cases",
                       body: modalBody,
                       showCloseButton: true
                   })
               }
           });
    }
})