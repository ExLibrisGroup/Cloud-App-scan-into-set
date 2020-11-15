import { HandScanComponent } from "./../hand-scan/hand-scan.component";
import { MatInput } from "@angular/material/input";
import { catchError, map } from "rxjs/operators";
import { EMPTY, forkJoin, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit, OnDestroy, ViewChild, Inject, ElementRef } from "@angular/core";
import {
  CloudAppRestService,
  CloudAppEventsService,
  Request,
  HttpMethod,
  Entity,
  PageInfo,
  RestErrorResponse,
} from "@exlibris/exl-cloudapp-angular-lib";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogClose,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild("stepper") stepper: MatStepper;
  @ViewChild(HandScanComponent) handScan: HandScanComponent;
  private pageLoad$: Subscription;
  pageSets: Entity[] = [];
  barcodes: string[] = [];
  selectedSet: Entity;
  loading: boolean = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  scanByHand: boolean = true;
  isMethodSelected: boolean = false;
  constructor(
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.pageLoad$ = this.eventsService.onPageLoad(this.onPageLoad);
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", null],
    });
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  onPageLoad = (pageInfo: PageInfo) => {
    this.pageSets = [];
    this.selectedSet = undefined;
    this.loading = true;
    let observables = [];
    for (let entity of pageInfo.entities.filter((val) => val.type === "SET")) {
      observables.push(
        this.restService.call(entity.link).pipe(
          map((res) =>
            res?.content?.value === "ITEM" && res?.type?.value === "ITEMIZED" ? entity : null
          ),
          catchError((err) => {
            console.error(err);
            this.toastr.error(`Error with loading set ${entity.description}, Please try again`);
            return EMPTY;
          })
        )
      );
    }
    forkJoin(observables).subscribe({
      next: (res: Entity[]) => {
        res.forEach((element: Entity) => {
          if (element) {
            this.pageSets.push(element);
          }
        });
      },
      complete: () => (this.loading = false),
    });
  };

  onScan(barcode: string): void {
    this.barcodes.push(barcode);
  }

  onFocus() {
    setTimeout(() => {
      this.handScan.barcodeVar.focus();
    }, 500);
  }
  onReset() {
    this.stepper.reset();
    this.barcodes = [];
    this.isMethodSelected = false;
    this.selectedSet = undefined;
  }
  openDialog() {
    let config = new MatDialogConfig();
    config.minHeight = "85%";
    config.minWidth = "85%";
    config.width = "85%";
    config.data = this.barcodes;
    const dialogRef = this.dialog.open(ConfirmDialog, config);
    dialogRef.afterClosed().subscribe((res) => {
      this.barcodes = res.data;
    });
  }
  onAdd() {
    let req: Request = {
      url: this.selectedSet.link,
      method: HttpMethod.POST,
      queryParams: { id_type: "BARCODE", op: "add_members" },
      requestBody: this.generateBody(),
    };
    this.loading = true;
    this.restService.call(req).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success("Successfully added barcodes");
        this.onReset();
      },
      error: (err: RestErrorResponse) => {
        this.toastr.error(err.message);
        console.error(err);
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }

  private generateBody() {
    let memberArr = [];
    for (let barcode of this.barcodes) {
      memberArr.push({ id: barcode });
    }
    return { members: { member: memberArr } };
  }
}

@Component({
  selector: "confirm-dialog",
  templateUrl: "confirm-dialog.html",
  styleUrls: ["confirm-dialog.scss"],
})
export class ConfirmDialog implements OnInit {
  faBarcode = faBarcode;
  @ViewChild(MatDialogClose, { static: false }) close: MatDialogClose;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string[],
    public dialogRef: MatDialogRef<ConfirmDialog>
  ) {}
  ngOnInit() {
    this.dialogRef.beforeClosed().subscribe(() => {
      this.dialogRef.close({ data: this.data });
    });
  }
}
