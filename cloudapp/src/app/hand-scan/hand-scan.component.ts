import { ToastrService } from "ngx-toastr";
import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { MatInput } from "@angular/material/input";

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

  constructor(private toastr: ToastrService) {}


  ngAfterContentChecked():void {
    setTimeout(()=>this.barcodeVar.focus(),200)
  }
  onBarcodeScan(barcode: string) {
    this.loading = true;
    this.toastr.success(`Scaned barcode : ${barcode}`);
    this.barcodeScan.emit(barcode);
    this.barcodeVar.value = "";
    this.barcodeFocus.emit();
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

}
