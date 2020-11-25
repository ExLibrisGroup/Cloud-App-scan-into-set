import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatInput } from "@angular/material/input";
import { AlertService } from "@exlibris/exl-cloudapp-angular-lib";

@Component({
  selector: "app-hand-scan",
  templateUrl: "./hand-scan.component.html",
  styleUrls: ["./hand-scan.component.scss"],
})
export class HandScanComponent implements AfterContentChecked {
  @ViewChild("barcodeVar", { static: false }) barcodeVar: MatInput;
  @Output("barcodeScan") barcodeScan = new EventEmitter<string>();
  @Output("barcodeFocus") barcodeFocus = new EventEmitter<null>();
  loading: boolean = false;

  constructor(private alert: AlertService) {}


  ngAfterContentChecked():void {
    setTimeout(()=>this.barcodeVar.focus(),200)
  }
  onBarcodeScan(barcode: string) {
    this.loading = true;
    this.alert.success(`Scaned barcode : ${barcode}`);
    this.barcodeScan.emit(barcode);
    this.barcodeVar.value = "";
    this.barcodeFocus.emit();
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

}
