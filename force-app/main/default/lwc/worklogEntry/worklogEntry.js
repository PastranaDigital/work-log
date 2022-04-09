import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';
import createWorkLog from '@salesforce/apex/WorkLogController.createWorkLog';

export default class WorklogEntry extends LightningElement {
	projectOptions = [
		{ label: 'Droids', value: 'Droids'},
		{ label: 'Lasers', value: 'Lasers'},
		{ label: 'Invisibility', value: 'Invisibility'},
		{ label: 'Magic', value: 'Magic'},
	];

	newRecord = {
		Date_Worked__c: '',
		Hours_Worked__c: '',
		Project__c: ''
	};

	@wire(CurrentPageReference) pageRef;

	handleDateChange(event) {
		console.log(event.detail.value);
		this.newRecord.Date_Worked__c = event.detail.value;
	}

	handleHourChange(event) {
		// console.log(Number(event.detail.value));
		if(Number(event.detail.value) != NaN) {
			this.newRecord.Hours_Worked__c = Number(event.detail.value);
		} else {
			this.newRecord.Hours_Worked__c = '';
			this.showNotification('Error', 'Please enter a number', 'error');
		}
		console.log('this.newRecord.Hours_Worked__c: ', this.newRecord.Hours_Worked__c);
	}

	handleProjectNameChange(event) {
		console.log(event.detail.value);
		this.newRecord.Project__c = event.detail.value;
	}

	handleSaveClick(event) {
		console.log('saving???');
		if (this.validate()) {
            // console.log('validated');
            this.createLogApex();
            // this.buttonPressed = true;
        } else {
            console.log('Please complete all fields');
            // this.buttonErrorMessage = 'Please complete required fields';
            this.showNotification('Error', 'Please complete all fields', 'error');
        }
	}

	validate() {
        // console.log('validating...');
        return Object.values(this.newRecord).every((element) => element != '');
    }

	createLogApex() {
        createWorkLog({ entry: this.newRecord })
            .then((result) => {
                this.message = result;
                this.error = undefined;
                this.recordSubmitted = true;
                console.log('result', this.message);
                this.showNotification('Success', 'New Work Log record created', 'success');
            })
            .catch((error) => {
                this.message = undefined;
                this.error = error;
                // this.errorSubmitting = true;
                // console.log("error", JSON.stringify(this.error));
                this.showNotification('Error', this.error, 'error');
            });
    }

	showNotification(title, message, variant) {
        //? variant: error, warning, success, info
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
}