import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { InvoiceDto } from '../models/invoice.dto';

@Component({
  selector: 'app-invoices',
  standalone: true,
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent implements OnInit {
  invoices!: InvoiceDto[] | null;

  constructor(private readonly invoiceService: InvoiceService) { }

  async ngOnInit() {
    this.invoices = await this.invoiceService.getAllInvoices();
  }
}
