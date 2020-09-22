trigger BI_CampaignSpendTrigger on Campaign_Spend__c (before insert, before update, after insert, after update){
	System.debug(LoggingLevel.INFO,'Entered BI_CampaignSpendTrigger');
	if (trigger.isBefore) {     		   
      	if (trigger.isInsert) {        		    	
       		if(!BS_PR_SubmitPRForApproval_VFCtrl.handleCampaignSpendBeforeInsert_IsExecuted){
            	BS_PR_SubmitPRForApproval_VFCtrl.handleCampaignSpendBeforeInsert_IsExecuted=true;
                BI_BudgetManagerLogic.handleCampaignSpendBeforeInsert(trigger.new);                
           }
      	} else if (trigger.isUpdate) {
      		BI_BudgetManagerLogic.handleCampaignSpendBeforeUpdate(trigger.oldMap, trigger.newMap); 
      	}
	}
    
    if (trigger.isAfter) {     		   
      	if (trigger.isInsert) {
            	BI_BudgetManagerLogic.insertCampaignPlanningMonthlyRecords(trigger.new);
       		    //BI_BudgetManagerLogic.calculateTotalMonthlyBudgetAfterInsert(trigger.new, trigger.oldMap, trigger.newMap);
                BI_BudgetManagerLogic.calculateTotalPlanningBudgetAfterInsert(trigger.new, trigger.newMap);
            
           }
      	else if (trigger.isUpdate) {
            BI_BudgetManagerLogic.calculateTotalPlanningBudgetAfterUpdate(trigger.new, trigger.oldMap, trigger.newMap);
      		//BI_BudgetManagerLogic.calculateTotalMonthlyBudgetAfterUpdate(trigger.new, trigger.oldMap, trigger.newMap);
      	}
	}
    
}