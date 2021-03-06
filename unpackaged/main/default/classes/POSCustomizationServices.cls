public class POSCustomizationServices {
    public static Boolean runTrigger = true;
    
    /**************************************************************************************************************
Author:        Craig Austgen
Company:       Slalom, LLC
Description:
Inputs:        accountId:
History
<Date>      <Authors Name>     <Brief Description of Change>
7/2018     	Craig Austgen       Initial Creation

***************************************************************************************************************/
    public static void updateInsertTextWithAccountName(Map<Id, POS_Customization__c> posItemMap) {
        Map<Id, POS_Customization__c> posItemsToUpdate = new Map<Id, POS_Customization__c>();
        Map<Id, POS_Customization__c> posItemsToUpdateNew = new Map<Id, POS_Customization__c>();
        //Map<Id, POS_Customization__c> barrel
        
        Id caseId;//added by mahesh
        String insertText;//added by mahesh
        List<POS_Customization__c> posItems = [select Id
                                               , Type__c
                                               , Insert_Text__c
                                               , Barrel__c
                                               , Barrel__r.Case__c
                                               , Barrel__r.Brand__c
                                               , Get_Insert_Text_From__c
                                               , Barrel__r.Case__r.Account_Missing__c
                                               , Barrel__r.Case__r.POS_Label_Account_Name__c
                                               , Barrel__r.Case__r.Retail_Account_Name__c
                                               , Barrel__r.Case__r.Retail_Account__r.Name
                                               , Case__r.Barrel__r.Case__r.Account_Missing__c
                                               , Case__r.Barrel__r.Case__r.Retail_Account_Name__c
                                               , Case__r.Barrel__r.Case__r.Retail_Account__r.Name
                                               , RecordTypeId from POS_Customization__c where Id IN :posItemMap.keySet()];
        
        
        for (POS_Customization__c posItem : posItems) {
            System.debug('>>>>>>>>>>' + posItem);
            //Added by Mahesh
            if(posItem.Barrel__r.Case__c!=null){
                caseId = posItem.Barrel__r.Case__c;
                System.debug('caseId is:::'+caseId);
            }
            
            if(posItem.Type__c == 'Bottle Plate Text' && posItem.Insert_Text__c != null){
                insertText = posItem.Insert_Text__c;
                System.debug('insertText is:::'+insertText);
            }
            
            if (posItem.Get_Insert_Text_From__c == 'Account Name') {
                if (posItem.RecordTypeId == SBP_Constants.POS_FULL_BARREL_RT_ID) {
                    if (posItem.Barrel__r.Case__r.Account_Missing__c) {
                        posItem.Insert_Text__c = posItem.Barrel__r.Case__r.Retail_Account_Name__c;
                        posItemsToUpdate.put(posItem.Id, posItem);
                    } else if (posItem.Barrel__r.Brand__c == 'Jim Beam' || posItem.Barrel__r.Brand__c == 'Cruzan') {
                        posItem.Insert_Text__c = posItem.Barrel__r.Case__r.POS_Label_Account_Name__c;
                        posItemsToUpdate.put(posItem.Id, posItem);
                    } else {
                        posItem.Insert_Text__c = posItem.Barrel__r.Case__r.Retail_Account__r.Name;
                        posItemsToUpdate.put(posItem.Id, posItem);
                    }
                    
                } else if (posItem.RecordTypeId == SBP_Constants.POS_SPLIT_BARREL_RT_ID) {
                    if (posItem.Case__r.Barrel__r.Case__r.Account_Missing__c) {
                        posItem.Insert_Text__c = posItem.Case__r.Barrel__r.Case__r.Retail_Account_Name__c;
                        posItemsToUpdate.put(posItem.Id, posItem);
                    } else {
                        posItem.Insert_Text__c = posItem.Case__r.Barrel__r.Case__r.Retail_Account__r.Name;
                        posItemsToUpdate.put(posItem.Id, posItem);
                    }
                }
            }
        }
        
        //Added by Mahesh
        List<POS_Customization__c> posItemsNew = [select Id
                                                  , Type__c
                                                  , Insert_Text__c
                                                  , Barrel__c
                                                  , Get_Insert_Text_From__c
                                                  from POS_Customization__c where Barrel__r.Case__c=:caseId];
        for(POS_Customization__c posItemNew : posItemsNew){
            System.debug('posItemNew is:::'+posItemNew);
            if(posItemNew.Type__c == 'Bottle Plate Text' && posItemNew.Insert_Text__c != null){
                insertText = posItemNew.Insert_Text__c;
                System.debug('insertText is:::'+insertText);
            }
            
            if(posItemNew.Get_Insert_Text_From__c == 'Bottle Label Text'){
                if(insertText!=null){
                    System.debug('insertText value inside if:::'+insertText);
                    posItemNew.Insert_Text__c = insertText;
                    posItemsToUpdateNew.put(posItemNew.Id, posItemNew);
                }
                
            }
        }
        
        if (!posItemsToUpdate.isEmpty()) {
            update posItemsToUpdate.values();
        }
        //Added by Mahesh
        if (!posItemsToUpdateNew.isEmpty()) {
            update posItemsToUpdateNew.values();
        }
    }
}