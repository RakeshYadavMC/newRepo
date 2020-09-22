trigger AccountApplicationTrigger on Account_Application__c (before update,before insert, after update) {
	if (Trigger.isBefore) {
		if (Trigger.isInsert) {
			AccountApplicationTriggerHandler.handleBeforeInsert(Trigger.New);
		} else if (Trigger.isUpdate) {
			AccountApplicationTriggerHandler.handleBeforeUpdate(Trigger.New, Trigger.oldMap);
		}  
	}

	if (Trigger.isAfter ) {
		/*if (Trigger.isInsert) {
			AccountApplicationTriggerHandler.handleAfterInsert(Trigger.New, Trigger.newMap);
		}*/ 
    	if (Trigger.isUpdate) {
			AccountApplicationTriggerHandler.handleAfterUpdate(Trigger.New, Trigger.oldMap);
		}
    }
}