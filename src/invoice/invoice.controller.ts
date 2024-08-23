import { Body, Controller, Get, Post, Render } from '@nestjs/common';

@Controller('invoice')
export class InvoiceController {
  @Get('/create')
  @Render('invoice/create')
  createInvoiceView() {}

  @Post()
  @Render('invoice/show')
  createInvoice(@Body() body: any) {
    const invoiceNumber = body['invoice-number'];
    const invoiceDate = body['invoice-date'];
    const invoiceDeadline = body['invoice-deadline'];
    const companyInfo = body['company-info'];
    const customerInfo = body['customer-info'];
    const products = this.parseProduct(body['product']);
    const total = products.reduce((acc, product) => acc + (product.quantity * product.price), 0);
    const note = body['note'];
    return {
      invoiceNumber,
      invoiceDate,
      invoiceDeadline,
      companyInfo,
      customerInfo,
      note,
      products,
      total,
    }
  }

  parseProduct(raw: string): any[] {
    const startIndex = raw.indexOf('{');
    const endIndex = raw.lastIndexOf('}');

    const jsonPart = raw.slice(startIndex, endIndex + 1);

    return JSON.parse(jsonPart).products;
  }
}
