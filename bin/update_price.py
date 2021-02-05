#!/usr/bin/env python
import os
import sys
import logging

if __name__ == "__main__":
    sys.path.append('../')
    sys.path.append('.')
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_eshop.settings")

    from django.db import connection
    from project_eshop.lib.btcprice import get_price
    from project_eshop.shop.models import Product

    logger = logging.getLogger('shop.update_price')
    
    exchange_rate = get_price()
    logger.debug("Current exchange rate is %s" % exchange_rate)

    if exchange_rate <= 0:
        raise Exception("Something is fishy, exchange rate cannot be zero or negative")

    for p in Product.objects.all():
        p.update_price(exchange_rate)
        if p.enabled:
            logger.debug("New price of product '%s' is %s" % (p.title, p.base_price))

    connection.close()
