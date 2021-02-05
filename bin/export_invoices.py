#!/usr/bin/env python
import os
import sys
import random

from django.conf import settings
from django.template.loader import render_to_string

transfrom = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZC'

transto = ''
for x in transfrom:
    transto += random.choice('Vrtzlawusjyop')


def trans(x):
    if not x:
        return x

    new = ''

    for c in x:
        if c in ' -/*_':
            new += c

        try:
            new += transto[transfrom.index(c)]
        except ValueError:
            pass

    return new


if __name__ == "__main__":
    sys.path.append('../')
    sys.path.append('.')
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_eshop.settings")

    from project_eshop.shop.models import Order
    from project_eshop.lib.pdf import PDFService

    orders = Order.objects.filter(
        address__country__code='CN',
        order_status=Order.SHIPPED,
        is_bulk=False,
    ).order_by('shipped_date')

    i = 1
    last_day = None
    for order in orders:

        if order.shipped_date.strftime('%Y-%m-%d') != last_day:
            i = 1

        pdf_service = PDFService()
        # order.address.addressee = trans(order.address.addressee)

        pdf_invoice = pdf_service.create_pdf(render_to_string('shop/order/invoice.html', {'order': order, 'SL': settings.SL_TEMPLATE_PARAMS}))

        filename = '/tmp/orders/' + order.shipped_date.strftime('%Y-%m-%d') + '-' + str(i) + '.pdf'
        print(filename)
        with open(filename, 'w') as pdf_file:
            pdf_file.write(pdf_invoice)
        i += 1
        last_day = order.shipped_date.strftime('%Y-%m-%d')
