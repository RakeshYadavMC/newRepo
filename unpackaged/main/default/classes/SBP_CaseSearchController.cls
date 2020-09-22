public class SBP_CaseSearchController {
    
/**************************************************************************************************************
Author:        Priyankar Saha
Company:       TCS
Description:   List view of My Single Barrel Orders
History
<Date>      <Authors Name>     <Brief Description of Change>
2/2020      Priyankar Saha       Initial Creation

***************************************************************************************************************/
    
    @AuraEnabled 
    public static List<Case> fetchCaseRecords(String strQuery, String brand, Boolean toggle){ 
        System.debug('Str Query:::'+strQuery);
        System.debug('Brand:::'+brand);
        System.debug('Toggle:::'+toggle);
        String searchQuery = '%'+strQuery+'%';
        Id singleBarrelProofSpecific = SBP_Constants.SINGLE_BARREL_PROOF_SPECIFIC_RT_ID;
        Id singleBarrelStandard = SBP_Constants.SINGLE_BARREL_STANDARD_RT_ID;
        Id singleBarrelSplitBarrel = SBP_Constants.SINGLE_BARREL_SPLIT_BARREL_RT_ID; 
        List<Case> listCaseRecords = new List<Case>();
        String soqlQuery = '';
        soqlQuery += 'SELECT Id,CaseNumber,Brand__c,Status,Type,CreatedDate,Submitter__r.Name,Barrel_Selected__c,Barrel_Selected_Date__c,Purchase_Order_Uploaded__c,Purchase_Order_Number__c,POS_Items_Selected__c,Bottle_Text_Entered__c, Account.Name, Retail_Account__r.Name FROM Case'
                                   + ' WHERE My_Case__c = True AND (RecordTypeId =: singleBarrelProofSpecific OR RecordTypeId =: singleBarrelStandard OR RecordTypeId =: singleBarrelSplitBarrel) '
                                    +   ' AND Status Not IN (\'Closed\',\'Closed - Abandoned\',\'Canceled\',\'Cancelled-Allocation\')';
        if(toggle){
            System.debug('---Inside Toggle---');
          soqlQuery += ' AND (Barrel_Selected__c = false OR Purchase_Order_Uploaded__c = false OR POS_Items_Selected__c = false OR Bottle_Text_Entered__c  = false)';
        }
        if(brand != null || !String.isEmpty(brand)){
            System.debug('---Inside Brand---');
          soqlQuery += ' AND Brand__c =:brand';
        }                            
        if(!String.isBlank(strQuery)){
            System.debug('---Inside SearchQuery---');
          soqlQuery +=  ' AND (CaseNumber like \'' +searchQuery + '\' OR Account.Name like \'' +searchQuery + '\' OR Retail_Account__r.Name like \'' +searchQuery + '\' OR Submitter__r.Name like \'' +searchQuery + '\')';
        }
        soqlQuery += ' ORDER BY CreatedDate DESC limit '+ Limits.getLimitQueryRows();
		System.debug('SOQL:::'+soqlQuery);
        listCaseRecords = Database.Query(soqlQuery);

        return listCaseRecords;
        
    }
    
}