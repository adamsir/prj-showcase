#!/usr/bin/env python
import os
import sys
from decimal import Decimal

print("Obsolete, but potentially useful")
sys.exit()

if __name__ == "__main__":
    sys.path.append('../')
    sys.path.append('.')
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_eshop.settings")

    from django.db import connection
    from project_eshop.shop.models import Order

    orders = Order.objects.filter(referred_by__email='sales+bitfinex@SomeCompany.com')
    for o in orders:
        print(o)
        for i in o.item_set.all():
            print(i, i.usd_price)
            usd_price = i.usd_price * ((100 - o.discount_perc) / Decimal('100'))
            print("New price: %s" % usd_price)
            #i.usd_price = usd_price
            #i.save()

    connection.close()
