import { Body, Controller, Delete, Get, Param, Post, Render } from '@nestjs/common';

@Controller('')
export class InvoiceController {
  @Get('')
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

    const formattedProducts = products.map((product: any) => {
      return {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price),
      }
    });

    return {
      invoiceNumber,
      invoiceDate,
      invoiceDeadline,
      companyInfo,
      customerInfo,
      note,
      products: formattedProducts,
      total: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total),
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
          <td class="border border-black">
            <input type="text" class="w-full p-1" value="${product.name}" name="items[${index+1}][name]" readonly>
          </td>
          <td class="border border-black">
            <input type="text" class="w-full p-1" value="${product.description}" name="items[${index+1}][description]" readonly>
          </td>
          <td class="border border-black">
            <input type="text" class="w-full p-1" value="${product.quantity}" name="items[${index+1}][quantity]" readonly>
          </td>
          <td class="border border-black">
            <input type="text" class="w-full p-1" value="${product.price}" name="items[${index+1}][price]" readonly>
          </td>
          <td class="border border-black">
            <div class="container flex flex-row justify-center">
              <button
                hx-post="/delete-product-item/${index}"
                hx-target="closest tbody"
                class="border border-black p-1 rounded m-1"
              >Delete</button>
            </div>
          </td>
        </tr>
      `;
    })

    formattedProducts.push(/*html*/`
      <tr>
        <td>
          <input type="text" placeholder="Name" name="item-name" class="w-full p-1 border border-gray-700 rounded">
        </td>
        <td>
          <input type="text" placeholder="Description" name="item-description" class="w-full p-1 border border-gray-700 rounded">
        </td>
        <td>
          <input type="number" placeholder="Quantity" name="item-quantity" class="w-full p-1 border border-gray-700 rounded">
        </td>
        <td>
          <input type="number" placeholder="Price" name="item-price" class="w-full p-1 border border-gray-700 rounded">
        </td>
        <td class="flex flex-row justify-center">
          <button
            hx-post="/save-product-item"
            hx-target="closest tbody"
            class="button border border-black p-1 rounded m-1"
          >Add</button>
        </td>
      </tr>
    `);
    return formattedProducts.join('');
  }
}
