import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject } from "rxjs";
import {
  InsertTodoRequest,
  EditTodoRequest,
  Todo,
} from "src/app/pages/todos/models/todolist.model";
import { TodoService } from "../../services/todo/todo.service";
import {
  ModalAnswer,
  ModalOptions,
} from "../alert-dialog/models/alert-dialog.model";
import { AlertDialogService } from "../alert-dialog/service/alert-dialog.service";

@Component({
  selector: "my-insert-dialog",
  templateUrl: "./insert-dialog.component.html",
  styleUrls: ["./insert-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InsertDialogComponent implements OnInit, OnDestroy {
  public todoForm: FormGroup;
  public mode: string = this.data ? "edit" : "insert";
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly todoService: TodoService,
    private readonly dialogRef: MatDialogRef<InsertDialogComponent>,
    private readonly confirmAlertService: AlertDialogService,
    @Inject(MAT_DIALOG_DATA) private readonly data: Todo
  ) {}

  ngOnInit(): void {
    console.log(this.mode);
    this.createForms();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  public confirmAction(): void {
    const modalOpt: ModalOptions = {
      actionType: "confirm",
      dialogMessage: {
        message: `Are you sure you want to ${this.mode} this todo?`,
      },
    };

    this.confirmAlertService
      .openConfirmAlertModal(modalOpt)
      .subscribe((answer: ModalAnswer) => {
        if (answer.answer === "yes") {
          this.mode === "edit" ? this.editTodo() : this.insertTodo();
        } else {
          console.log(answer);
        }
      });
  }

  public close(): void {
    this.dialogRef.close();
  }

  public editTodo(): void {
    const request: EditTodoRequest = {
      id: this.data.id,
      title: this.todoForm.get("title").value,
      content: this.todoForm.get("title").value,
    }
    
    this.todoService.editTodo(request).subscribe((response) => {
      const modalOpt = {
        actionType: "alert",
        dialogMessage: {
          message: "Success!",
        },
      };
      this.confirmAlertService
        .openConfirmAlertModal(modalOpt)
        .subscribe(() => {
          this.dialogRef.close("new");
        });
      console.log(response);
    });
  }

  public insertTodo(): void {
    const request: InsertTodoRequest = {
      title: this.todoForm.get("title").value,
      content: this.todoForm.get("title").value,
    };

    this.todoService.createNewTodo(request).subscribe((response) => {
      const modalOpt = {
        actionType: "alert",
        dialogMessage: {
          message: "Success!",
        },
      };
      this.confirmAlertService
        .openConfirmAlertModal(modalOpt)
        .subscribe(() => {
          this.dialogRef.close("new");
        });
      console.log(response);
    });
  }

  private createForms(): void {
    this.todoForm = this.formBuilder.group({
      title: this.data ? this.data.title : "",
      content: this.data ? this.data.content : "",
    });
  }
}
