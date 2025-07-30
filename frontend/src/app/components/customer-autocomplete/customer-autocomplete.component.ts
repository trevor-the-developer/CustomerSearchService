import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, startWith, map, catchError } from 'rxjs/operators';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.interface';

@Component({
  selector: 'app-customer-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="autocomplete-container">
      <input
        type="text"
        class="autocomplete-input"
        [formControl]="searchControl"
        [placeholder]="placeholder"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKeyDown($event)"
        autocomplete="off"
      />

      <div class="autocomplete-dropdown" *ngIf="showDropdown">
        <div class="loading" *ngIf="isLoading$ | async">
          <div class="spinner"></div>
          Searching...
        </div>

        <div class="error-message" *ngIf="errorMessage$ | async as error">
          {{ error }}
        </div>

        <div class="no-results" *ngIf="!isLoading && !errorMessage && (results$ | async)?.length === 0 && searchControl.value && searchControl.value.length >= minChars">
          No customers found for "{{ searchControl.value }}"
        </div>

        <div class="min-chars-message" *ngIf="searchControl.value && searchControl.value.length < minChars">
          Type at least {{ minChars }} characters to search
        </div>

        <div
          *ngFor="let customer of results$ | async; trackBy: trackByCustomerId; let i = index"
          class="autocomplete-item"
          [class.highlighted]="i === highlightedIndex"
          (click)="selectCustomer(customer)"
          (mouseenter)="highlightedIndex = i"
        >
          <div class="customer-name">{{ customer.name }}</div>
          <div class="customer-details">
            <span class="address">{{ customer.address }}, {{ customer.postcode }}</span>
            <span class="tags" *ngIf="customer.tags.length > 0">
              <span class="tag" *ngFor="let tag of customer.tags">{{ tag }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .autocomplete-container {
      position: relative;
      width: 100%;
    }

    .autocomplete-input {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .autocomplete-input:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .autocomplete-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-top: none;
      border-radius: 0 0 8px 8px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .loading {
      padding: 16px;
      text-align: center;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      padding: 16px;
      color: #dc3545;
      background-color: #f8d7da;
      border-bottom: 1px solid #f5c6cb;
      text-align: center;
    }

    .no-results, .min-chars-message {
      padding: 16px;
      text-align: center;
      color: #666;
      font-style: italic;
    }

    .min-chars-message {
      background-color: #f8f9fa;
      border-bottom: 1px solid #eee;
    }

    .autocomplete-item {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
      transition: background-color 0.2s ease;
    }

    .autocomplete-item:hover,
    .autocomplete-item.highlighted {
      background-color: #f8f9fa;
    }

    .autocomplete-item:last-child {
      border-bottom: none;
    }

    .customer-name {
      font-weight: 600;
      margin-bottom: 4px;
      color: #333;
      font-size: 14px;
    }

    .customer-details {
      font-size: 13px;
      color: #666;
    }

    .address {
      display: block;
      margin-bottom: 6px;
    }

    .tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .tag {
      background-color: #e9ecef;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      color: #495057;
      font-weight: 500;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .autocomplete-input {
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 14px 16px;
      }
      
      .autocomplete-dropdown {
        max-height: 300px;
      }
    }
  `]
})
export class CustomerAutocompleteComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Search customers...';
  @Input() minChars: number = 2;
  @Input() debounceMs: number = 300;

  @Output() customerSelected = new EventEmitter<Customer>();
  @Output() searchChanged = new EventEmitter<string>();

  searchControl = new FormControl('');
  results$: Observable<Customer[]>;
  isLoading$ = new BehaviorSubject<boolean>(false);
  errorMessage$ = new BehaviorSubject<string | null>(null);

  showDropdown = false;
  highlightedIndex: number = -1;
  errorMessage: string | null = null;
  isLoading = false;

  private currentResults: Customer[] = [];
  private destroy$ = new Subject<void>();

  constructor(private customerService: CustomerService) {
    this.results$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(this.debounceMs),
      distinctUntilChanged(),
      switchMap(query => this.performSearch(query || '')),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.searchChanged.emit(value || '');
      this.highlightedIndex = -1;
    });

    // Subscribe to results to cache them for keyboard navigation
    this.results$.subscribe(results => {
      this.currentResults = results;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private performSearch(query: string): Observable<Customer[]> {
    this.errorMessage = null;
    this.errorMessage$.next(null);

    if (!query || query.trim().length < this.minChars) {
      this.isLoading$.next(false);
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    this.isLoading$.next(true);

    return this.customerService.searchCustomers(query.trim()).pipe(
      map(response => {
        this.isLoading$.next(false);
        return response.customers;
      }),
      catchError(error => {
        this.isLoading$.next(false);
        this.errorMessage = error.message;
        this.errorMessage$.next(this.errorMessage);
        return EMPTY;
      })
    );
  }

  onFocus(): void {
    this.showDropdown = true;
  }

  onBlur(): void {
    // Delay hiding dropdown to allow for click events
    setTimeout(() => {
      this.showDropdown = false;
      this.highlightedIndex = -1;
    }, 150);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.showDropdown || this.currentResults.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.currentResults.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex >= 0 && this.highlightedIndex < this.currentResults.length) {
          this.selectCustomer(this.currentResults[this.highlightedIndex]);
        }
        break;
      case 'Escape':
        this.showDropdown = false;
        this.highlightedIndex = -1;
        break;
    }
  }

  selectCustomer(customer: Customer): void {
    this.searchControl.setValue(customer.name);
    this.customerSelected.emit(customer);
    this.showDropdown = false;
    this.highlightedIndex = -1;
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }

  clear(): void {
    this.searchControl.setValue('');
    this.showDropdown = false;
    this.highlightedIndex = -1;
  }

  setValue(value: string): void {
    this.searchControl.setValue(value);
  }
}