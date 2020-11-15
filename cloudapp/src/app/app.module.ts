import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule, getTranslateModule } from "@exlibris/exl-cloudapp-angular-lib";
import { ToastrModule } from "ngx-toastr";
import { NgxDropzoneModule } from "ngx-dropzone";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ConfirmDialog, MainComponent } from "./main/main.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HandScanComponent } from "./hand-scan/hand-scan.component";
import { FileScanComponent } from "./file-scan/file-scan.component";
import { HelpComponent } from "./help/help.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

export function getToastrModule() {
  return ToastrModule.forRoot({
    positionClass: "toast-top-right",
    timeOut: 2000,
  });
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HandScanComponent,
    FileScanComponent,
    ConfirmDialog,
    HelpComponent,
  ],
  entryComponents: [ConfirmDialog],
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxDropzoneModule,
    getTranslateModule(),
    getToastrModule(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
