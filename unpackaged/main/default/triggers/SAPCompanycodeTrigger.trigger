trigger SAPCompanycodeTrigger on SAP_Company_Code__c (before insert, before update, after insert, after update) {
    Map<id,SAP_Company_Code__c> IdcodeMap=new Map<Id,SAP_Company_Code__c>();
    if (Trigger.isBefore) {
        if(Trigger.isInsert) {
           for (SAP_Company_Code__c codes : Trigger.new) {  
               if(codes.Account__c== Null){
                   idcodeMap.put(codes.Id, codes);
               }   
           }           
        }
        if(IdcodeMap.size() > 0) {
            database.executeBatch(new BatchSAPCompanyCodeVendorAccount(idcodeMap)); 
        }
    }
}