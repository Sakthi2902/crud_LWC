import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import deleteRecord from '@salesforce/apex/ContactController.deleteRecord';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex'
export default class ContactManagementDemo extends LightningElement {
    // Variables
    //@7
    searchKey='';
    wiredContactResult;
    recordId;
    contacts;
    errors;
    //@5 
    isModalOpen=false;
    recordId;

    // Column definitions
    columns = [
        { label: 'First Name', fieldName: 'FirstName' },
        { label: 'Last Name', fieldName: 'LastName' },
        { label: 'Title', fieldName: 'Title' },
        {
            label: 'Account Name',
            fieldName: 'AccountUrl', // This field contains the URL
            type: 'url', // Define it as a URL
            typeAttributes: {
                label: { fieldName: 'AccountName' }, // Display AccountName as the label
                target: '_blank' // Open link in a new tab
            }
        },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        {
           type :'action',//triangle shape --@1
           typeAttributes :{rowActions:this.getrowActions}
        }
    ];

    // Fetch data using wire
    @wire(getContacts, { searchKeyword:'$searchKey'})
    getwiredcontacts(result) {
        this.wiredContactResult=result;
        const { data, error } = result;
        if (data) {
            this.contacts = data.map(contact => {
                const flatContact = { ...contact };
                flatContact.AccountName = contact.Account.Name; // Displayed Account Name
                flatContact.AccountUrl = `/lightning/r/Account/${contact.AccountId}/view`; // URL for the Account
                return flatContact;
               
                
            });
            this.errors = undefined;
            
        } else if (error) {
            this.contacts = undefined;
            this.errors = error;
        }
    }
    getrowActions(row,doneCallback){  //@2
        const actions=[
            {label:'edit', name :"edit"},//edit 
            {label:'delete', name :'delete'}//delete
        ];
        //defining the actions and pass it 
        doneCallback(actions);
    }

    //@4
    handleRowAction(event){
        const action =event.detail.action;
        const rowId= event.detail.row.Id;

        switch(action.name){
            //@5
            case'edit' :
             this.isModalOpen=true; 
            //@8 preload the data using the id 
            this.recordId=rowId

            break;

            case 'delete':
                this.deleteContact(rowId);
                break;

            default:
                break;
        }
    }
    get modalClass() {
        return this.isModalOpen ? 'slds-modal slds-fade-in-open' : 'slds-modal';
    }
    
    deleteContact(contactId) {
        return deleteRecord({ contactId: contactId })
        .then(()=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Success',
                    message:"Contact Deleted Successfully",
                    variant:'success'

                })
            )
            this.refreshData();

        }).catch(error=>{
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Error deleting the record ',
                    message:error.body.message,
                    variant:'error'

                })
            )
        })  // Add return here
    }
    
    closeModal(){
        this.isModalOpen=false;
    }
    handleSuccess(event){
        this.dispatchEvent(
            new ShowToastEvent({
                title:'Success ',
                message:"Contact Updated Successfully",
                variant:'success'

            })
        );
        this.isModalOpen=false;
        this.refreshData();
    }
    refreshData(){
        return  this.wiredContactResult? refreshApex(this.wiredContactResult):undefined;
    }
    handleSearch(event){
        this.searchKey=event.target.value

    }

    handleContactCreate(){
        this.isModalOpen=true;
        this.recordId=null;
      
    }
}
