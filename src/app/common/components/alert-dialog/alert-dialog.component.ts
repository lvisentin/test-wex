import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModalOptions } from "./models/alert-dialog.model";

@Component({
  selector: "app-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  styleUrls: ["./alert-dialog.component.scss"],
})
export class AlertDialogComponent {
  public modalAction = this.data.actionType;
  public modalText = this.data.dialogMessage;
  constructor(@Inject(MAT_DIALOG_DATA) private readonly data: ModalOptions) {}
}
