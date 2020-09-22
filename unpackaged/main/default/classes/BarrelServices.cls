public class BarrelServices {
    public static final Id MAKERS_MARK_FULL_BARREL_RT_ID = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Makers_Mark_Full_Barrel').getRecordTypeId();
    public static final Id ELTESORO_FULL_BARREL_RT_ID = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('El_Tesoro_Full_Barrel').getRecordTypeId();
    public static final Id ELTESORO_REMOTE_BARREL_RT_ID = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('El_Tesoro_Remote_Selection').getRecordTypeId();
    
    /**************************************************************************************************************
Author:        Craig Austgen
Company:       Slalom, LLC
Description:    Once a barrel has been selected the case attached to the barrel will need to be updated
to reflect that
History
<Date>      <Authors Name>     <Brief Description of Change>
7/2018      Craig Austgen       Initial Creation

***************************************************************************************************************/
    public static void checkIfBarrelWasSelected(List<Barrel__c> barrels, Map<Id, Barrel__c> barrelMap) {
        Set<Id> caseIdsToUpdate = new Set<Id>();
        Map<Id, Case> casesToUpdateMap = new Map<Id, Case>();
        
        // check to see if case related to barrel is a split barrel
        for (Barrel__c barrel : barrels) {
            Barrel__c oldBarrel = barrelMap.get(barrel.Id);
            if (SBP_Constants.fullBarrelRtIds.contains(barrel.RecordTypeId)) {
                if (oldBarrel.Selection_Date__c == null && barrel.Selection_Date__c != null) {
                    caseIdsToUpdate.add(barrel.Case__c);
                }
            }
        }
        // if case related to barrel is not of type split barrel then we can update the case directly
        for (Case c : [select Id, Barrel_Selected__c from Case where Id IN :caseIdsToUpdate]) {
            c.Barrel_Selected__c = true;
            c.Barrel_Selected_Date__c = Datetime.now();
            casesToUpdateMap.put(c.Id, c);
        }
        
        if (!casesToUpdateMap.isEmpty()) {
            update casesToUpdateMap.values();
        }
    }
    
    /**************************************************************************************************************
Author:        Craig Austgen
Company:       Slalom, LLC
Description:
History
<Date>      <Authors Name>     <Brief Description of Change>
7/2018      Craig Austgen       Initial Creation

***************************************************************************************************************/
    public static void checkFinalDetailsOfBarrel(List<Barrel__c> barrels, Map<Id, Barrel__c> barrelMap) {
        Set<Id> caseIdsToUpdate = new Set<Id>();
        Map<Id, Case> casesToUpdateMap = new Map<Id, Case>();
        
        // check to see if case related to barrel is a split barrel
        for (Barrel__c barrel : barrels) {
            Barrel__c oldBarrel = barrelMap.get(barrel.Id);
            // for standard barrel order
            if (SBP_Constants.standardBarrelRTIds.contains(barrel.RecordTypeId)) {
                if ((oldBarrel.Quantity__c == null && barrel.Quantity__c != null) ||
                    (String.isBlank(oldBarrel.SKU__c) && String.isNotBlank(barrel.SKU__c)) ||
                    (oldBarrel.Ship_Date__c == null && barrel.Ship_Date__c != null)) {
                        caseIdsToUpdate.add(barrel.Case__c);
                    }
            }
            // for Proof specific barrel orders
            else if (SBP_Constants.proofSpecificBarrelRTIds.contains(barrel.RecordTypeId)) {
                if ((oldBarrel.Quantity__c == null && barrel.Quantity__c != null) ||
                    (String.isBlank(oldBarrel.SKU__c) && String.isNotBlank(barrel.SKU__c))) {
                        
                        caseIdsToUpdate.add(barrel.Case__c);
                    }
            }
        }
        
        // if case related to barrel is not of type split barrel then we can update the case directly
        for (Case c : [select Id, Status, RecordTypeId from Case where Id IN :caseIdsToUpdate]) {
            if (c.RecordTypeId == SBP_Constants.SINGLE_BARREL_STANDARD_RT_ID) {
                c.Status = SBP_Constants.PENDING_FINAL_DETAILS;
                casesToUpdateMap.put(c.Id, c);
            } else if (c.RecordTypeId == SBP_Constants.SINGLE_BARREL_PROOF_SPECIFIC_RT_ID) {
                c.Status = SBP_Constants.PENDING_PURCHASE_ORDER;
                casesToUpdateMap.put(c.Id, c);
            }
            
        }
        
        if (!casesToUpdateMap.isEmpty()) {
            update casesToUpdateMap.values();
        }
    }
    
    /**************************************************************************************************************
Author:        Craig Austgen
Company:       Slalom, LLC
Description:    Once the final details are entered for the barrel orders they will be sent out to the Sales Rep,
Distributor Contact and any additional people that are listed in the ccEmail field
History
<Date>      <Authors Name>     <Brief Description of Change>
7/2018      Craig Austgen       Initial Creation

***************************************************************************************************************/
    public static void emailFinalBarrelDetails(List<Barrel__c> barrels, Map<Id, Barrel__c> barrelMap) {
        EmailTemplate template = [SELECT Id, Subject, HtmlValue, DeveloperName, Body FROM EmailTemplate WHERE DeveloperName = :SBP_Constants.BARREL_FINAL_DETAILS_EMAIL_TEMPLATE_NAME limit 1];
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        Map<Id, Barrel__c> newBarrelMap = new Map<Id, Barrel__c>();
        
        for (Barrel__c barrel : [select id, Case__r.Submitter__c, Case__r.Submitter__r.Email, Case__r.Contact.Email, Case__r.CcEmail__c from Barrel__c where Id IN: barrelMap.keySet()]) {
            newBarrelMap.put(barrel.Id, barrel);
        }
        
        for (Barrel__c barrel : barrels) {
            Barrel__c oldBarrel = barrelMap.get(barrel.Id);
            if (!oldBarrel.Barrel_Approved__c && barrel.Barrel_Approved__c) {
                List<String> emailsToSendTo = new List<String>();
                // add submitter email(Sales Rep)
                if (String.isNotBlank(newBarrelMap.get(barrel.Id).Case__r.Submitter__r.Email)) {
                    emailsToSendTo.add(newBarrelMap.get(barrel.Id).Case__r.Submitter__r.Email);
                }
                // add contact email
                if (String.isNotBlank(newBarrelMap.get(barrel.Id).Case__r.Contact.Email)) {
                    emailsToSendTo.add(newBarrelMap.get(barrel.Id).Case__r.Contact.Email);
                }
                
                if (String.isNotBlank(newBarrelMap.get(barrel.Id).Case__r.CcEmail__c)) {
                    String ccEmails = newBarrelMap.get(barrel.Id).Case__r.CcEmail__c;
                    List<String> emailAddresses = ccEmails.split(';');
                    emailsToSendTo.addAll(emailAddresses);
                }
                OrgWideEmailAddress[] owea = [select Id from OrgWideEmailAddress where Address = 'single.barrels@beamsuntory.com'];
                
                Messaging.SingleEmailMessage singleMail = new Messaging.SingleEmailMessage();
                singleMail.setToAddresses(emailsToSendTo);
                singleMail.setTargetObjectId(newBarrelMap.get(barrel.Id).Case__r.Submitter__c);
                singleMail.setTemplateId(template.Id);
                singleMail.setWhatId(barrel.Id);
                singleMail.setSaveAsActivity(false);
                singleMail.setReplyTo('single.barrels@beamsuntory.com');
                singleMail.setOrgWideEmailAddressId(owea[0].Id);
                //singleMail.setSenderDisplayName('Beam Suntory Customer Service');
                emails.add(singleMail);
            }
        }
        List<Messaging.SendEmailResult> emailResults = Messaging.sendEmail(emails);
    }
    
    
    /**************************************************************************************************************
Author:        Craig Austgen
Company:       Slalom, LLC
Description:    Barrel Numbers need to be incremented per brand so a custom object stores the next barrel number
and each time a barrel is created, that number will be updated and the barrel number object
will also be updatd to reflect the next barrel number
History
<Date>      <Authors Name>     <Brief Description of Change>
7/2018      Craig Austgen       Initial Creation

***************************************************************************************************************/
    public static void addBarrelNumberToBarrelRecord(List<Barrel__c> barrels) {
        System.debug('inside addBarrelNumberToBarrelRecord:::'+barrels);
        Map<String, String> brandToInteger = new Map<String, String>();
        Map<String, Id> brandToBarrelNumberRecord = new Map<String, Id>();
        List<Barrel_Number__c> barrelNumbersToUpdate = new List<Barrel_Number__c>();
        String elTesoroBarrelNumber;
        Integer nextBarrelNumber;
        
        for (Barrel_Number__c barrelNumber : [select id, Brand__c, Product_Type__c, Next_Barrel_Number__c from Barrel_Number__c]) {
            System.debug('inside for::::'+barrelNumber);
            String brandTypeKey = barrelNumber.Brand__c + '-' + barrelNumber.Product_Type__c;
            brandToInteger.put(brandTypeKey , barrelNumber.Next_Barrel_Number__c);
            brandToBarrelNumberRecord.put(brandTypeKey, barrelNumber.Id);
            //Added for El Tesoro
            if(barrelNumber.Brand__c=='El Tesoro'){
                elTesoroBarrelNumber=barrelNumber.Next_Barrel_Number__c;
                brandToInteger.put(brandTypeKey , elTesoroBarrelNumber);
            }
            System.debug('elTesoroBarrelNumber is:::'+elTesoroBarrelNumber + 'brandToInteger is::' +brandToInteger);
        }
        
        for (Barrel__c barrel : barrels) {
            String brandTypeKey = barrel.Brand__c + '-' + barrel.Product_Type__c;
            
            
            if (brandToInteger.containsKey(brandTypeKey) && SBP_Constants.fullBarrelRtIds.contains(barrel.RecordTypeId) && (String.isBlank(barrel.Barrel_Number__c) || barrel.Barrel_Number__c == null)) {
                System.debug('inside Barrel If:::');
                barrel.Barrel_Number__c = brandToInteger.get(brandTypeKey);
                nextBarrelNumber = Integer.valueOf(barrel.Barrel_Number__c) + 1;
                brandToInteger.put(brandTypeKey , String.valueOf(nextBarrelNumber));
                System.debug('brandToInteger::'+brandToInteger);
            }
            
            //Added for El Tesoro
            if(barrel.Brand__c=='El Tesoro' && (String.isBlank(barrel.Barrel_Number__c) || barrel.Barrel_Number__c == null)){
                brandTypeKey = barrel.Brand__c + '-' + 'Full Barrel';
                barrel.Barrel_Number__c = elTesoroBarrelNumber;
                System.debug('barrel Number is:::'+barrel.Barrel_Number__c);
                nextBarrelNumber = Integer.valueOf(barrel.Barrel_Number__c) + 1;
                System.debug('nextBarrelNumber is:::'+nextBarrelNumber);
                brandToInteger.put(brandTypeKey , String.valueOf(nextBarrelNumber));
                System.debug('brandToInteger::'+brandToInteger);
            }
        }
        
        for (String barrelKey : brandToBarrelNumberRecord.keySet()) {
            System.debug('barrelKey is:::'+barrelKey);
            if (brandToInteger.containsKey(barrelKey)) {
                System.debug('inside brandToInteger if::::'+brandToInteger.get(barrelKey));
                Barrel_Number__c bNumber = new Barrel_Number__c();
                bNumber.put('Id', brandToBarrelNumberRecord.get(barrelKey));
                bNumber.put('Next_Barrel_Number__c', brandToInteger.get(barrelKey));
                barrelNumbersToUpdate.add(bNumber);
                System.debug('barrelNumbersToUpdate:::'+barrelNumbersToUpdate);
            }
        }
        
        if (!barrelNumbersToUpdate.isEmpty()) {
            System.debug('inside if (!barrelNumbersToUpdate.isEmpty())');
            update barrelNumbersToUpdate;
        }
    }
    
    /**************************************************************************************************************
Author:        Craig Austgen
Company:       Slalom, LLC
Description:    Once the ship date of the barrel is reached then a workflow will update the barrel record and
this method will update the status of the case to "Order Shipped"
History
<Date>      <Authors Name>     <Brief Description of Change>
7/2018      Craig Austgen       Initial Creation

***************************************************************************************************************/
    public static void barrelHasShipped(List<Barrel__c> barrels, Map<Id, Barrel__c> barrelMap) {
        Set<Id> caseIds = new Set<Id>();
        Map<Id, Case> casesToUpdate = new Map<Id, Case>();
        
        for (Barrel__c barrel : barrels) {
            Barrel__c oldBarrel = barrelMap.get(barrel.Id);
            String brandTypeKey = barrel.Brand__c + '-' + barrel.Product_Type__c;
            if (!oldBarrel.Order_Shipped__c && barrel.Order_Shipped__c && barrel.Ship_Date__c != null) {
                caseIds.add(barrel.Case__c);
            }
        }
        
        /* for (Case c : [select id, Status from Case where Id IN :caseIds]) {
c.Status = SBP_Constants.ORDER_SHIPPED;
casesToUpdate.put(c.Id, c);
}

if (!casesToUpdate.isEmpty()) {
update casesToUpdate.values();
} */
    } 
    
    /**************************************************************************************************************
Author:        Sripal Kotha
Company:       TCS
Description:   Once the SKU is Entered on the barrel object the SKU Entered Date should update the time stamp for Insert and Update operation
History
<Date>      <Authors Name>     <Brief Description of Change>
9/2019      Sripal Kotha          Initial Creation

***************************************************************************************************************/
    public static void updateTimestampForBarrel(List<Barrel__c> barrels, Map<Id, Barrel__c> oldMap) {
        for (Barrel__c barrelToUpdate : barrels) {
            if (barrelToUpdate.RecordTypeId.equals(MAKERS_MARK_FULL_BARREL_RT_ID) || barrelToUpdate.RecordTypeId.equals(ELTESORO_FULL_BARREL_RT_ID) || barrelToUpdate.RecordTypeId.equals(ELTESORO_REMOTE_BARREL_RT_ID)) {
                if (oldMap != null) {
                    Barrel__c oldBarrelRecord = oldMap.get(barrelToUpdate.Id);
                    if (String.isNotBlank(barrelToUpdate.SKU__c) && (oldBarrelRecord.SKU__c != barrelToUpdate.SKU__c)) {
                        barrelToUpdate.SKU_Entered_Date__c = Datetime.now();
                    }
                } else {
                    if (String.isNotBlank(barrelToUpdate.SKU__c)) {
                        barrelToUpdate.SKU_Entered_Date__c = Datetime.now();
                    }
                }
            }
        }
    }
    
    /**************************************************************************************************************    
Description: SR-179687 Added By Ajeeta Soni(TCS)
History : 
8/2020     Ajeeta       Initial Creation
**************************************************************************************************************/
    public static void updateBarrelReadySubCaseWithBarrelPO(List<Barrel__c> barrels,Map<Id, Barrel__c> barrelMap) {
        Id CruzanFullRId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Cruzan_Full_Barrel').getRecordTypeId();
        Id CruzanKitRId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Cruzan_Sample_Kit').getRecordTypeId();
        Id JimFullRId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Jim_Beam_Full_Barrel').getRecordTypeId();
        Id JimKitRId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Jim_Beam_Sample_Kit').getRecordTypeId();
        Map<Id,Case> caseList = new Map<Id,Case>();
        Set<Id> barrelCaseIds = new Set<Id>();
        for(Barrel__c barrel : barrels){
            Barrel__c oldBarrel = barrelMap.get(barrel.Id);
            if(barrel.PO_Number__c != null){
                if((barrel.RecordTypeId != CruzanFullRId) && (barrel.RecordTypeId != CruzanKitRId) && (barrel.RecordTypeId != JimFullRId) && (barrel.RecordTypeId != JimKitRId) && (barrel.Case__c != null)){
                    barrelCaseIds.add(barrel.Case__c);
                }   
            }
        }
        
        for(Barrel__c barr : [Select id,Case__c,PO_Number__c from Barrel__c where Case__c in: barrelCaseIds]){
            for(Case cc :[Select id,Status,ParentId,Purchase_Order_Number__c,PO_Number__c,RecordTypeId from case where ParentId in: barrelCaseIds]){
                If(cc.RecordTypeId == SBP_Constants.BARREL_READY_TO_ENTER_RT_ID){
                cc.Purchase_Order_Number__c = barr.PO_Number__c;
               caseList.put(cc.Id,cc);
                }
            }
        }
        if (!caseList.isEmpty()) {
            update caseList.values();
        }
    } 
    /**************************************************************************************************************    
Description: SR-179687 Added By Ajeeta Soni(TCS)
History : 
8/2020     Ajeeta       Initial Creation
**************************************************************************************************************/
    public static void updateParentCaseWithBarrelPO(List<Barrel__c> barrels,Map<Id, Barrel__c> barrelMap) {
        Id CruzanFullRId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Cruzan_Full_Barrel').getRecordTypeId();
        Id CruzanKitRId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Cruzan_Sample_Kit').getRecordTypeId();
        Id JimFullRId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Jim_Beam_Full_Barrel').getRecordTypeId();
        Id JimKitRId = Schema.SObjectType.Barrel__c.getRecordTypeInfosByDeveloperName().get('Jim_Beam_Sample_Kit').getRecordTypeId();
        Map<Id,Case> caseList = new Map<Id,Case>();
        List<Barrel__c> barreList = new List<Barrel__c>();
        List<Case> parentCaseList = new List<Case>();
        Set<Id> barrelCaseIds = new Set<Id>();
        for(Barrel__c barrel : barrels){
            Barrel__c oldBarrel = barrelMap.get(barrel.Id);
            
            if((barrel.RecordTypeId != CruzanFullRId) && (barrel.RecordTypeId != CruzanKitRId) && (barrel.RecordTypeId != JimFullRId) && (barrel.RecordTypeId != JimKitRId) && (barrel.Case__c != null)){
                barrelCaseIds.add(barrel.Case__c);
            } 
        }
        barreList = [Select id,Case__c,PO_Number__c,SKU__c from Barrel__c where Case__c in: barrelCaseIds];
        parentCaseList =[Select id,Status,ParentId,Purchase_Order_Number__c,Related_Barrel_SKU__c,Related_Barrel_PO_Number__c,PO_Number__c from case where Id in: barrelCaseIds];
        
        for(Barrel__c barr :barreList ){
            for(Case cc :parentCaseList){
                If(barr.Case__c != null && (barr.SKU__c != null) || (barr.PO_Number__c != null)){
                    cc.Related_Barrel_PO_Number__c = barr.PO_Number__c;
                    system.debug('=======caselistvalues====' + cc.Related_Barrel_SKU__c);
                    cc.Related_Barrel_SKU__c = barr.SKU__c;
        system.debug('=======caselistvalues====' + cc.Related_Barrel_SKU__c);
                    caseList.put(cc.Id,cc);
                }
            }
        }
        if (!caseList.isEmpty()) {
            update caseList.values();
        }
        system.debug('=======caselistvalues====' +caseList.values());
    } 
    
    /**************************************************************************************************************    
Description: SR_186925 Added By MaheshBabu M(TCS)
History : This method will update sample selected to true on samplekit if barrel selected is true on case
9/2020     MaheshBabu M       Initial Creation
**************************************************************************************************************/
    public static void updateSampleSelectedToTrue(List<Barrel__c> barrels, Map<Id, Barrel__c> barrelMap) {
        Set<Id> barrelIds = new Set<Id>();
        Set<Id> caseIds = new Set<Id>();
        Set<Id> sampleKitIds = new Set<Id>();
        Map<Id, Sample_Kit__c> samplekitsToUpdateMap = new Map<Id, Sample_Kit__c>();
        Map<Id, Sample__c> samplesToUpdateMap = new Map<Id, Sample__c>();
        List<Barrel__c> barrelList = new List<Barrel__c>();
        
        for (Barrel__c barrel : barrels) {
            Barrel__c oldBarrel = barrelMap.get(barrel.Id);
            if (barrel.RecordTypeId == SBP_Constants.KNOB_CREEK_FULL_BARREL_RT_ID && barrel.Case__c !=null) {
                if(barrel.Warehouse__c !=null && barrel.Selection_Date__c !=null){
                    barrelIds.add(barrel.Id);
                    caseIds.add(barrel.Case__c);
                }
                    
            }
        }
        
        for(Sample_Kit__c samplekit: [Select Id, Sample_Selected__c,Case__r.Barrel_Selected__c from Sample_Kit__c where Case__c IN:caseIds]){
            if(samplekit.Case__r.Barrel_Selected__c == true){
                samplekit.Sample_Selected__c = true;
                samplekitsToUpdateMap.put(samplekit.Id,samplekit);
            }
        }
        
        if (!samplekitsToUpdateMap.isEmpty()) {
            update samplekitsToUpdateMap.values();
        }
        
    }
}