public with sharing class ContactController {
    
    // Constructor - no need to put @AuraEnabled here
    
    // Method to get Contact records with @AuraEnabled annotation for Lightning components
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String searchKeyword) {
        if (String.isNotBlank(searchKeyword)) {
            String searchword = '%' + searchKeyword + '%';  // Added missing semicolon
            return [SELECT Id, FirstName, LastName, Title, AccountId, Account.Name, Email 
                    FROM Contact 
                    WHERE AccountId != null 
                    AND FirstName LIKE :searchword 
                    LIMIT 50];
        } else {
            // Fetch a list of contacts from the database with a limit of 50 if searchKeyword is blank or null
            return [SELECT Id, FirstName, LastName, Title, AccountId, Account.Name, Email 
                    FROM Contact 
                    WHERE AccountId != null 
                    LIMIT 50];
        }

    }
    
    
    @AuraEnabled(cacheable=true)
    public static void deleteRecord(String contactId) {
        
        Contact contactToDelete = [SELECT Id FROM Contact WHERE Id = :contactId LIMIT 1];
        
        if (contactToDelete != null) {
            delete contactToDelete;
        }
    }
    @AuraEnabled
    public static void deleteBulk(List<Id> lstContactIds) {
        // Ensure that the contact list is not empty before performing the delete
        if(lstContactIds != null && !lstContactIds.isEmpty()) {
            List<Contact> lstToDelete = [SELECT Id FROM Contact WHERE Id IN :lstContactIds];
            delete lstToDelete;
        }
    }
    
    
    
}
