import { Component, OnInit, ViewChild } from "@angular/core";
import { TodoService } from "src/app/common/services/todo/todo.service";
import { ListState } from "src/app/common/enums/ListState";
import { Todo } from "./models/todolist.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { FormBuilder } from "@angular/forms";
import { debounceTime, takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import {
  MatDialog,
} from "@angular/material/dialog";
import { InsertDialogComponent } from "src/app/common/components/insert-dialog/insert-dialog.component";
import { AlertDialogService } from "src/app/common/components/alert-dialog/service/alert-dialog.service";
import {
  ModalAnswer,
  ModalOptions,
} from "src/app/common/components/alert-dialog/models/alert-dialog.model";
import { Subject } from "rxjs";
@Component({
  selector: "app-todos",
  templateUrl: "./todos.component.html",
  styleUrls: ["./todos.component.scss"],
})
export class TodosComponent implements OnInit {
  public listState: ListState = ListState.success;
  public dataSource = new MatTableDataSource<Todo>();
  public displayedColumns: Array<string> = [
    "id",
    "title",
    "content",
    "actions",
  ];
  public searchbarForm;
  private destroy: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly todoService: TodoService,
    private readonly formBuilder: FormBuilder,
    private readonly confirmAlertService: AlertDialogService
  ) {}

  ngOnInit(): void {
    this.createForms();
    this.getTodos();
    this.subscribeToSearchBarChanges();
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  public openCreateDialog(todo: Todo = null): void {
    const dialogRef = this.matDialog.open<InsertDialogComponent, Todo>(InsertDialogComponent, {
      data: todo,
      width: "400px",
    });

    dialogRef.afterClosed().subscribe((dialogAnswer) => {
      if (dialogAnswer === "new") {
        this.getTodos();
      }
    });
  }

  public openDeleteConfirmation(todoId: string): void {
    const modalOpt: ModalOptions = {
      actionType: "confirm",
      dialogMessage: {
        message: "Are you sure you want to delete this?",
      },
    };

    this.confirmAlertService
      .openConfirmAlertModal(modalOpt)
      .pipe(takeUntil(this.destroy))
      .subscribe((answer: ModalAnswer) => {
        if (answer.answer === "yes") {
          this.deleteTodo(todoId);
        }
      });
  }

  private deleteTodo(todoId: string) {
    this.todoService
      .deleteTodo(todoId)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        const modalOpt: ModalOptions = {
          actionType: "alert",
          dialogMessage: {
            message: "Successful delete",
          },
        };

        this.confirmAlertService
          .openConfirmAlertModal(modalOpt)
          .pipe(takeUntil(this.destroy))
          .subscribe(() => {
            this.getTodos();
          });
      });
  }

  private createForms(): void {
    this.searchbarForm = this.formBuilder.group({
      searchInput: "",
    });
  }

  private getTodos(): void {
    this.listState = ListState.loading;
    this.todoService.getAllTodos().subscribe((response: Array<Todo>) => {
      this.listState = ListState.success;
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private subscribeToSearchBarChanges(): void {
    this.searchbarForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((change) => {
        this.dataSource.filter = change.searchInput;
      });
  }
}
