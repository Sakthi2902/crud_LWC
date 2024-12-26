public with sharing class ContactController {
    
    // Constructor - no need to put @AuraEnabled here
    
    // Method to get Contact records with @AuraEnabled annotation for Lightning components
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        // Fetch a list of contacts from the database with a limit of 10
        return [SELECT Id, FirstName, LastName, Title ,AccountId, Account.Name,Email FROM Contact LIMIT 20];
    }
    @AuraEnabled(cacheable=true)
    public static void deleteRecord(String contactId) {
        
        Contact contactToDelete = [SELECT Id FROM Contact WHERE Id = :contactId LIMIT 1];
        
        if (contactToDelete != null) {
            delete contactToDelete;
        }
    }
    
    
}
