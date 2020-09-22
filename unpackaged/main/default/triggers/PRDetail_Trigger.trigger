/**************************************************************************************
   Trigger/Class Name   : PRDetail_Trigger
   Created Date         : 06-Nov-2019
   Auther               : Harikrishna P
   Function             : 
   Test Class           : BS_PRDetail_Trigger_Test
   Updates :
 *************************************************************************************/

trigger PRDetail_Trigger on PR_Detail__c(before insert,before update, after insert, after update,before delete) {
    System.debug('TRIGGER OPERATION TYPE >>>>>>>>> ' + Trigger.operationType);
    if (Trigger.isBefore) {
        if (Trigger.isInsert) {
            PRDetail_TriggerHandler.handleBeforeInsert(Trigger.New);
        }
        if (Trigger.isUpdate) {
            PRDetail_TriggerHandler.handleBeforeUpdate(Trigger.New, Trigger.oldMap);
        }
		if (Trigger.isDelete) {
            PRDetail_TriggerHandler.handlebeforeDelete(Trigger.oldMap);
        }        
    } else if (Trigger.isAfter) {
        if (Trigger.isInsert) {
            PRDetail_TriggerHandler.handleAfterInsert(Trigger.New);
        }
        if (Trigger.isUpdate) {
            PRDetail_TriggerHandler.handleAfterUpdate(Trigger.New, Trigger.oldMap);
        }        
    }
}