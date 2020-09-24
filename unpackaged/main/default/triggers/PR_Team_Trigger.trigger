/**************************************************************************************
   Trigger/Class Name   : PR_Team_Trigger
   Created Date         : 10-Nov-2019
   Auther               : Harikrishna P
   Function             : 
   Test Class           : BS_PR_Team_Trigger_Test
   Updates :
 *************************************************************************************/

trigger PR_Team_Trigger on PR_Team__c (after Insert,before delete) {
      System.debug('PR_Team_Trigger ...TRIGGER OPERATION TYPE >>>>>>>>> ' + Trigger.operationType);
      if (Trigger.isBefore) {
        if (Trigger.isDelete) {
          PR_Team_TriggerHandler.handleBeforeDelete(Trigger.oldMap);
        }
    
      } else if (Trigger.isAfter) {
        if (Trigger.isInsert) {
          PR_Team_TriggerHandler.handleAfterInsert(Trigger.New);
        }    
      }

}