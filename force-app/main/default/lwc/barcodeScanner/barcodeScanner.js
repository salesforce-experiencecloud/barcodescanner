import { LightningElement, api } from 'lwc';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';
import {FlowNavigationNextEvent} from 'lightning/flowSupport';

export default class PrescriptionBarCodeScanner extends LightningElement {

    myScanner = getBarcodeScanner();

    @api scanTitleText;
    @api hideScanTitleText = false;
    @api scanSubtitleText;
    @api hideScanSubtitleText = false;
    @api sldsIconName;
    @api hideSldsIconName = false;
    @api noMobilePublisherText;
    @api hideNoMobilePublisherText = false;
    @api instructionText;
    @api hideInstructionText = false;
    @api successText;
    @api hideSuccessText = false;

    @api cameraFacing;

    @api barcodeScanResult;

    @api
    get showButton() {
        return this.isMobilePublisher;
    }

    //isMobilePublisher = window.navigator.userAgent.indexOf('CommunityHybridContainer') > -1;
    isMobilePublisher = (this.myScanner != null && this.myScanner.isAvailable() );

    connectedCallback() {
        this.scanTitleText = (this.scanTitleText !== undefined && this.scanTitleText !== null) ? this.scanTitleText : 'Scan Barcode' ;
        this.scanSubtitleText = (this.scanSubtitleText !== undefined && this.scanSubtitleText !== null) ? this.scanSubtitleText : 'Tap here to start scanning.' ;
        this.instructionText = (this.instructionText !== undefined && this.instructionText !== null) ? this.instructionText : 'Scan a code' ;
        this.successText = (this.successText !== undefined && this.successText !== null) ? this.successText : 'Scan successful!' ;
        this.noMobilePublisherText = (this.noMobilePublisherText !== undefined && this.noMobilePublisherText !== null) ? this.noMobilePublisherText : 'Barcode scanning is only available in the mobile app.' ;
        this.sldsIconName = (this.sldsIconName !== undefined && this.sldsIconName !== null && this.sldsIconName.trim() !== '') ? this.sldsIconName : 'utility:scan';
        this.cameraFacing = (this.cameraFacing !== undefined && this.cameraFacing !== null) ? this.cameraFacing : 'BACK' ;

        this.hideScanTitleText = this.hideScanTitleText === true;
        this.hideScanSubtitleText = this.hideScanSubtitleText === true;
        this.hideSldsIconName = this.hideSldsIconName === true;
        this.hideNoMobilePublisherText = this.hideNoMobilePublisherText === true;
        this.hideInstructionText = this.hideInstructionText === true;
        this.hideSuccessText = this.hideSuccessText === true;

    }

    handleBeginScanClick(event) {

        // Reset scannedBarcode to empty string before starting new scan
        this.scannedBarcode = '';

        let options = {};
        options.barcodeTypes = ["code128", "code39", "code93", "ean13", "ean8", "upca", "upce", "qr", "datamatrix", "itf", "pdf417"];

        if(this.hideInstructionText !== true)
        {
            options.instructionText = this.instructionText;
        }

        if(this.hideSuccessText !== true)
        {
            options.successText = this.successText;
        }

        if(this.cameraFacing === 'FRONT')
        {
            options.cameraFacing = this.cameraFacing;
        }

        this.myScanner.beginCapture(options).then((result) => {

            if(result.value)
            {
                this.barcodeScanResult = result.value;
                const navigateNextEvent = new FlowNavigationNextEvent();
                this.dispatchEvent(navigateNextEvent);
            }           

        }).catch((error) => {
            console.log(JSON.stringify(error));
        }).finally(() => {
            this.myScanner.endCapture();
        });

    }
}