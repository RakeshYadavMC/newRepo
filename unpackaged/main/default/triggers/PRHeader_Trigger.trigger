/**************************************************************************************
   Trigger/Class Name   : PRDetail_Trigger
   Created Date         : 12-Nov-2019
   Auther               : Harikrishna P
   Function             : 
   Test Class           :
   Updates :
 *************************************************************************************/

trigger PRHeader_Trigger on PR_Header__c(before insert,before update, after update) {
  System.debug('TRIGGER OPERATION TYPE >>>>>>>>> ' + Trigger.operationType);
  if (Trigger.isBefore) {
    if (Trigger.isInsert) {
      PRHeader_TriggerHandler.handleBeforeInsert(Trigger.New);
    }
    if (Trigger.isUpdate) {
        PRHeader_TriggerHandler.handleBeforeUpdate(Trigger.Newmap, Trigger.oldMap);
        
    }
  } 
  else if (Trigger.isAfter) {
    if (Trigger.isUpdate) {
      if(PRHeader_TriggerHandler.isFirstTime){   
        PRHeader_TriggerHandler.isFirstTime = false;    
        PRHeader_TriggerHandler.handleAfterUpdate(Trigger.Newmap, Trigger.oldMap);
       }        
    }
  }
}