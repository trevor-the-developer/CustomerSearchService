import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { CustomerAutocompleteComponent } from './components/customer-autocomplete/customer-autocomplete.component';
import { Customer } from './models/customer.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CustomerAutocompleteComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Customer Search Service';
  selectedCustomer: Customer | null = null;
  searchQuery = '';

  onCustomerSelected(customer: Customer): void {
    this.selectedCustomer = customer;
    console.log('Selected customer:', customer);
  }

  onSearchChanged(query: string): void {
    this.searchQuery = query;
  }

  clearSelection(): void {
    this.selectedCustomer = null;
  }
}
