import { Component, Injectable, ViewEncapsulation } from '@angular/core';
import {
  posBrandsData,
  PosBrandsInterfaceData,
} from '../../../../../data/posBrandsData';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BrandSelectionService {
  selectedBrands: PosBrandsInterfaceData[] = [];

  constructor() {}
}

@Component({
  selector: 'app-brand-popup',
  imports: [MatIconModule, MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './brand-popup.html',
  styleUrl: './brand-popup.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BrandPopup {
  brands: PosBrandsInterfaceData[] = [];
  selectedBrands: PosBrandsInterfaceData[] = [];

  constructor(
    private dialogRef: MatDialogRef<BrandPopup>,
    private brandSelectionService: BrandSelectionService // Inject the service here
  ) {}

  ngOnInit(): void {
    // Load brands directly from the posCategoriesData array
    this.brands = posBrandsData;
    // Retrieve previously selected brands from the service
    this.selectedBrands = this.brandSelectionService.selectedBrands;
  }

  selectBrand(brand: PosBrandsInterfaceData) {
    // Toggle selection status
    brand.selected = !brand.selected;

    if (brand.selected) {
      // If the brand is newly selected, add it to the selectedBrands array
      this.selectedBrands.push(brand);
    } else {
      // If the brand is being deselected, remove it from the selectedBrands array
      const index = this.selectedBrands.findIndex(
        (selectedBrand) => selectedBrand.id === brand.id
      );
      if (index !== -1) {
        this.selectedBrands.splice(index, 1);
      }
    }
  }

  closeDialogBrand() {
    // Update selected brands in the service
    this.brandSelectionService.selectedBrands = this.selectedBrands;
    this.dialogRef.close(this.selectedBrands); // Pass selected brands to the parent component
  }
}
