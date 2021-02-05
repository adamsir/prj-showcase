#!/usr/bin/env python
import os
import sys
from datetime import datetime


print("Obsolete, but potentially useful")
sys.exit()

if __name__ == "__main__":
    sys.path.append('../')
    sys.path.append('.')
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_eshop.settings")

    from django.db import connection
    from project_eshop.shop.models import Order, Item, Product

    bulk_orders = [39351, 39360, 36252, 39384]

    orders = Order.objects.select_related().filter(
        created__gte=datetime(2017, 6, 21, 14, 20)  # First affected order: 21/06 14:21
    ).filter(
        created__lte=datetime(2017, 6, 21, 21, 48)  # Last affected order: 21/06 21:47
    ).order_by('-id')

    print len(orders)

    in_stock_black_Project = Product.objects.get(pk=11)

    for order in orders:
        print('order.id %s' % order.id)

        if order.id not in bulk_orders:
            for item in order.items:
                if item.product_id == 27:
                    item.product = in_stock_black_Project
                    item.name = in_stock_black_Project.title
                    item.save()
                    print('changed order id %s' % order.id)
                    order.add_note('Converted - switch backorder product to in stock.', False)

            order.save()
        else:
            print('sorry, bulk')

    connection.close()
