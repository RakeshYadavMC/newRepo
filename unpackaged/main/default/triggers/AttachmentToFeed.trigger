trigger AttachmentToFeed on Attachment (after insert, before delete) {
    if(Trigger.isAfter)
    {   
     AttachmentHandler.AttachmentToFeed(Trigger.new);
    }
    if(Trigger.isDelete)
    {   
     AttachmentHandler.handleBeforeDeleteActions(trigger.oldMap);
    }

}