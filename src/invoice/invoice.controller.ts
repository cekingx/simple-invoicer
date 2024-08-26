import { Body, Controller, Delete, Get, Param, Post, Render } from '@nestjs/common';

@Controller('invoice')
export class InvoiceController {
  @Get('/create')
  @Render('invoice/create')
  createInvoiceView() {
    const today = new Date();
    const tomorrow = new Date().setDate(today.getDate() + 1);
    const todayDate = today.toISOString().split('T')[0];
    const tomorrowDate = new Date(tomorrow).toISOString().split('T')[0];

    return {
      todayDate,
      tomorrowDate,
    }
  }

  @Post()
  @Render('invoice/show')
  createInvoice(@Body() body: any) {
    const invoiceNumber = body['invoice-number'];
    const invoiceDate = body['invoice-date'];
    const invoiceDeadline = body['invoice-deadline'];
    const companyInfo = body['company-info'];
    const customerInfo = body['customer-info'];
    const products = body['items'] || [];
    const total = products.reduce((acc: number, product: any) => acc + (product.quantity * product.price), 0);
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

  @Post('save-product-item')
  saveProductItem(@Body() body: any) {
    const products: {
      name: string;
      description: string;
      quantity: string;
      price: string;
    }[] = body.items || [];

    products.push({
      name: body['item-name'],
      description: body['item-description'],
      quantity: body['item-quantity'],
      price: body['item-price'],
    })

    return this.render(products);
  }

  @Post('delete-product-item/:index')
  deleteProductItem(@Body() body: any, @Param() param: any) {
    console.log('body', body);
    const products: {
      name: string;
      description: string;
      quantity: string;
      price: string;
    }[] = body.items || [];

    products.splice(param.index, 1);

    return this.render(products);
  }

  render(products: any[]): string {
    const formattedProducts = products.map((product, index) => {
      return /*html*/`
        <tr>
          <td>
            <input type="text" value="${product.name}" name="items[${index+1}][name]" readonly>
          </td>
          <td>
            <input type="text" value="${product.description}" name="items[${index+1}][description]" readonly>
          </td>
          <td>
            <input type="text" value="${product.quantity}" name="items[${index+1}][quantity]" readonly>
          </td>
          <td>
            <input type="text" value="${product.price}" name="items[${index+1}][price]" readonly>
          </td>
          <td>
            <button hx-post="/invoice/delete-product-item/${index}" hx-target="closest tbody" class="button bg-black text-white">Delete</button>
          </td>
        </tr>
      `;
    })

    formattedProducts.push(/*html*/`
      <tr>
        <td>
          <input type="text" placeholder="Name" name="item-name">
        </td>
        <td>
          <input type="text" placeholder="Description" name="item-description">
        </td>
        <td>
          <input type="number" placeholder="Quantity" name="item-quantity">
        </td>
        <td>
          <input type="number" placeholder="Price" name="item-price">
        </td>
        <td>
          <button hx-post="/invoice/save-product-item" hx-target="closest tbody" class="button bg-black text-white">Add</button>
        </td>
      </tr>
    `);
    return formattedProducts.join('');
  }
}
