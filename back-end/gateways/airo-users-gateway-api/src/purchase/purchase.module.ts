import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PurchaseService } from './purchase.service';

@Module({
  imports: [HttpModule],
  exports: [PurchaseService],
  providers: [PurchaseService],
})
export class PurchaseModule { }
