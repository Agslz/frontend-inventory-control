import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { KeycloakService } from 'keycloak-angular';
import { ProductElement } from 'src/app/modules/product/product/product.component';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  chartBar: any;
  chartDoughnut: any;
  
  username: any;
  constructor(
    private productService: ProductService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.username = this.keycloakService.getUsername();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (data: any) => {
        console.log('response products', data);
        this.processProductResponse(data);
      },
      (error: any) => {
        console.log('error in products', error);
      }
    );
  }

  processProductResponse(resp: any) {
    const nameProduct: String[] = [];
    const account: number[] = [];

    if (resp.metadata[0].code == '00') {
      let listCProduct = resp.product.products;

      listCProduct.forEach((element: ProductElement) => {
        nameProduct.push(element.name);
        account.push(element.account);
      });

      //Chart bar
      this.chartBar = new Chart('canvas-bar', {
        type: 'bar',
        data: {
          labels: nameProduct,
          datasets: [{ label: 'Products', data: account }],
        },
      });

      //Doughnut bar
      this.chartDoughnut = new Chart('canvas-doughnut', {
        type: 'doughnut',
        data: {
          labels: nameProduct,
          datasets: [{ label: 'Products', data: account }],
        },
      });
    }
  }
}
