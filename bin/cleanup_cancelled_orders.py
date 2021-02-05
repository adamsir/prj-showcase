#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    sys.path.append('../')
    sys.path.append('.')
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_eshop.settings")

    from project_eshop.shop.models import Order
   
    # Remove cancelled orders after few days from database
    Order.cleanup_cancelled() 
