import { FeatureFlagGuard } from "./common/guards/feature-flag.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "todos",
    loadChildren: () =>
      import("./pages/todos/todos.module").then((m) => m.TodosModule),
    canActivate: [FeatureFlagGuard],
    data: {
      featureFlag: "todos",
    },
  },
  {
    path: "",
    redirectTo: "todos",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "todos",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRouting {}
