/**************************************************************************************
   Trigger/Class Name   : PR_Phasing_Trigger
   Created Date         : 03-Dec-2019
   Auther               : Harikrishna P
   Function             : PR_Phasing_TriggerHandler
   Test Class           : PR_Phasing_TriggerHandlerTest
   Updates :
 *************************************************************************************/

trigger PR_Phasing_Trigger on PR_Phasing__c (before Insert,after insert,before update,after update,before delete) {
  System.debug('TRIGGER OPERATION TYPE >>>>>>>>> ' + Trigger.operationType);
    if (Trigger.isBefore && Trigger.isInsert) {
      PR_Phasing_TriggerHandler.handleBeforeInsert(Trigger.New);
    }
    if (Trigger.isbefore && Trigger.isupdate) {
      PR_Phasing_TriggerHandler.handleBeforeUpdate(Trigger.NewMap, trigger.oldMap);
    }
    if (Trigger.isAfter && Trigger.isInsert) {
      PR_Phasing_TriggerHandler.handleAfterInsert(Trigger.NewMap);
    }
    if (Trigger.isAfter && Trigger.isupdate) {
      PR_Phasing_TriggerHandler.handleAfterUpdate(Trigger.NewMap, trigger.oldMap);
    }
    if (Trigger.isbefore && Trigger.isDelete) {
      PR_Phasing_TriggerHandler.handleBeforeDelete(Trigger.oldMap);
    }
}