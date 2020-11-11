import { ToastrService } from "ngx-toastr";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-file-scan",
  templateUrl: "./file-scan.component.html",
  styleUrls: ["./file-scan.component.scss"],
})
export class FileScanComponent implements OnInit {
  files: File[] = [];
  loading: boolean = false;
  @Output("barcodeScan") barcodeScan = new EventEmitter<string>();


  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}
  onSelect(event) {
    this.loading = true;
    this.files = [];
    event.addedFiles.forEach((file: File) => {
      file
        .text()
        .finally(() => {(this.loading = false);this.toastr.success("Successfully scanned file")})
        .then<void>((barcodes: string): void => {
          barcodes
            .split(/\r?\n/)
            .filter((e) => e)
            .forEach((barcode: string) => {
              this.barcodeScan.emit(barcode);
            });
        })
        .catch((reason) => {
          this.toastr.error("Could not load file :" + reason);
          Promise.reject(reason);
        });
    });
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
