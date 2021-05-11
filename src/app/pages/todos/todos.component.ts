import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { TodoService } from "src/app/common/services/todo/todo.service";
import { ListState } from "src/app/common/enums/ListState";
import { Todo, TodoDialogData } from "./models/todolist.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, takeUntil } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
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
  encapsulation: ViewEncapsulation.None,
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
  public searchbarForm: FormGroup;
  public orderForm: FormGroup;
  public orderBy = [
    {
      name: "No order",
      value: 0,
      item: null,
      type: null,
    },
    {
      name: "Title A-Z",
      value: 1,
      item: "title",
      type: "asc",
    },
    {
      name: "Title Z-A",
      value: 2,
      item: "title",
      type: "desc",
    },
    {
      name: "Content A-Z",
      value: 3,
      item: "content",
      type: "asc",
    },
    {
      name: "Content Z-A",
      value: 4,
      item: "content",
      type: "desc",
    },
  ];
  private destroy: Subject<boolean> = new Subject<boolean>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

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

  public openDialog(todo: Todo = null): void {
    const dialogRef = this.matDialog.open<
      InsertDialogComponent,
      TodoDialogData
    >(InsertDialogComponent, {
      data: { ...todo, mode: todo ? "edit" : "insert" },
      width: "450px",
    });

    dialogRef.afterClosed().subscribe((dialogAnswer) => {
      if (dialogAnswer === "new") {
        this.getTodos();
      }
    });
  }

  public openInfoDialog(todo: Todo): void {
    const dialogRef = this.matDialog.open<
      InsertDialogComponent,
      TodoDialogData
    >(InsertDialogComponent, {
      data: { ...todo, mode: "view" },
      width: "450px",
    });
  }

  public orderData(): void {
    const type = this.orderForm.controls.sortBy.value.type;
    const item = this.orderForm.controls.sortBy.value.item;

    if (!type || !item) {
      this.dataSource.filteredData.sort((a, b) =>
      a.id > b.id
        ? 1
        : b.id > a.id
        ? -1
        : 0
    );
    } else {
      if (type === "asc") {
        this.dataSource.filteredData.sort((a, b) =>
          a[item].toLowerCase() > b[item].toLowerCase()
            ? 1
            : b[item].toLowerCase() > a[item].toLowerCase()
            ? -1
            : 0
        );
      } else {
        this.dataSource.filteredData.sort((a, b) =>
          a[item].toLowerCase() < b[item].toLowerCase()
            ? 1
            : b[item].toLowerCase() < a[item].toLowerCase()
            ? -1
            : 0
        );
      } 
    }
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

    this.orderForm = this.formBuilder.group({
      sortBy: "",
    });
  }

  private getTodos(): void {
    this.listState = ListState.loading;
    this.todoService.getAllTodos().subscribe((response: Array<Todo>) => {
      this.listState = ListState.success;
      this.dataSource.data = response;
      this.dataSource.paginator = this.paginator;
      this.orderData();
    });
  }

  private subscribeToSearchBarChanges(): void {
    this.searchbarForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((change) => {
        this.dataSource.filter = change.searchInput;
        this.orderData();
      });
  }
}
