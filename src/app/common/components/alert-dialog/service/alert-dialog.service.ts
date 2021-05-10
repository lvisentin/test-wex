import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AlertDialogComponent } from "../alert-dialog.component";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ModalOptions } from "../models/alert-dialog.model";

@Injectable({
  providedIn: "root",
})
export class AlertDialogService {
  constructor(private readonly matDialog: MatDialog) {}

  public openConfirmAlertModal(options: ModalOptions): Observable<any> {
    const dialogRef = this.matDialog.open(AlertDialogComponent, {
      minWidth: "370px",
      height: "200px",
      data: options,
    });

    return dialogRef
      .afterClosed()
      .pipe(map((result: string) => ({ answer: result })));
  }
}
