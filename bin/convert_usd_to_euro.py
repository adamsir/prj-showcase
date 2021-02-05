#!/usr/bin/env python
import os
import sys
from datetime import datetime

from decimal import Decimal

from django.conf import settings

if __name__ == "__main__":
    sys.path.append('../')
    sys.path.append('.')
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_eshop.settings")

    from django.db import connection
    from project_eshop.shop.models import Order, CurrencyRate

    orders = Order.objects.select_related().filter(converted=False).order_by('-id')
    euro_rate = CurrencyRate.objects.get(symbol='EUR')
    usd_rate = CurrencyRate.objects.get(symbol='USD')

    conversion_rate = (usd_rate.rate / euro_rate.rate).quantize(Decimal('0.01'))

    for order in orders:
        if settings.EUR_CONVERSION_TIMESTAMP > order.created and not order.converted:

            for item in order.items:

                print('order id', order.id)

                if item.usd_price != Decimal('0.00'):
                    # print('origin price:', item.usd_price)

                    item.usd_price = (item.usd_price * conversion_rate).quantize(Decimal('0.01'))

                    # print('changed to:', item.usd_price)

                if item.usd_shipping_price != Decimal('0.00'):
                    # print('origin shipping price:', item.usd_shipping_price)

                    item.usd_shipping_price = (item.usd_shipping_price * conversion_rate).quantize(Decimal('0.01'))

                item.save()
                # print('changed to:', item.usd_shipping_price)

            order.converted = True
            order.czk_currency_rate = euro_rate
            order.conversion_rate = conversion_rate
            # print('order items converted at conversion rate ', conversion_rate)
            order.save()

    connection.close()
