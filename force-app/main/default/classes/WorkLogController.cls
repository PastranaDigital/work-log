public with sharing class WorkLogController {
    @AuraEnabled
    public static Work_Log__c createWorkLog(Work_Log__c entry) {
        if (entry != null)
            insert entry;
        return entry;
    }
}
