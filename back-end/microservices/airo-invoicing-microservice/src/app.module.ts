import { Module } from '@nestjs/common';
import { InvoicingModule } from './invoicing/invoicing.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    InvoicingModule
  ],
})
export class AppModule { }