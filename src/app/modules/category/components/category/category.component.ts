import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  isAdmin: any;

  constructor(
    private categoryServices: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getCategories() {
    this.categoryServices.getCategories().subscribe(
      (data: any) => {
        console.log('Categories request', data);
        this.processCategoriesResponse(data);
      },
      (error: any) => {
        console.log('Error', error);
      }
    );
  }

  processCategoriesResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];

    if (resp.metadata[0].code == '00') {
      let listCategory = resp.categoryResponse.category;

      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);

      this.dataSource.paginator = this.paginator;
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Category saved!', 'Successful');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar(
          'An error occurred while saving the category',
          'Error'
        );
      }
    });
  }

  edit(id: number, name: string, description: string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: { id: id, name: name, description: description },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Category updated!', 'Successful');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar(
          'An error occurred while updating the category',
          'Error'
        );
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id: id, module: 'category' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Category deleted!', 'Successful');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar(
          'An error occurred while deleting the category',
          'Error'
        );
      }
    });
  }

  search(term: string) {
    if (term.length === 0) {
      return this.getCategories();
    }

    this.categoryServices.getCategorieById(term).subscribe((resp: any) => {
      this.processCategoriesResponse(resp);
    });
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  exportExcel() {
    this.categoryServices.exportCategories().subscribe((data: any) => {
      let file = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      let fileUrl = URL.createObjectURL(file);
      var anchor = document.createElement('a');
      anchor.download = 'categories.xlsx';
      anchor.href = fileUrl;
      anchor.click();
      this.openSnackBar('File exported successfully!', 'Successful');
    }),(error:any)=>{
      this.openSnackBar('Couldnt export the file', 'Error');

    };
  }
}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
