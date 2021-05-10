import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AvatarComponent } from "../components/avatar/avatar.component";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TodoListComponent } from "../components/todo-list/todo-list.component";
import { InsertDialogComponent } from "../components/insert-dialog/insert-dialog.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { AlertDialogModule } from "../components/alert-dialog/alert-dialog.module";


@NgModule({
  declarations: [AvatarComponent, TodoListComponent, InsertDialogComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    AlertDialogModule,
  ],
  exports: [AvatarComponent, TodoListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
