#!/usr/bin/env python
import os
import sys
from decimal import Decimal
from django.db import connection, transaction
from datetime import datetime, timedelta

print("Obsolete, but potentially useful")
sys.exit()

if __name__ == "__main__":
    sys.path.append('../')
    sys.path.append('.')
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_eshop.settings")

    from django.db import connection
    from project_eshop.shop.models import Order, Product

    orders = Order.objects.filter(
        transaction_status=Order.PAID,
        order_status=Order.NEW,
        is_bulk=False,
        created__lt=datetime.now() - timedelta(days=2)  # pojistka abychom to neudelali dvakrat
    )

    standard_shipping = Product.objects.get(packaging_code='SSH', enabled=True)

    i = 0
    csv = ''
    for order in orders:
        for item in order.items:
            if item.name == 'Cable for Android phones':

                # print("Processing order ", order.id, order.user_email)
                csv += str(order.id) + ';'
                csv += order.user.get_full_name() + ';'
                csv += order.user_email + ';'
                csv += order.get_package_code
                csv += '\n'

                comment = 'Split order (ID %s)' % order.id
                if order.comment:
                    comment = comment + ' - original comment: %s' % order.comment

                new_order = Order(
                    user=order.user,
                    address_id=order.user.address.id,
                    price=item.price,
                    discount_perc=order.discount_perc,
                    referred_by=order.referred_by,
                    comment=comment,
                    transaction_status=order.transaction_status,
                    converted=True,
                    payment_processor=order.payment_processor,
                    is_bulk=True,  # we set bulk temporary, so no emails will be sent
                )

                new_order.save()

                # add OGT cable:
                new_order.item_set.create(
                    name=item.name,
                    product=item.product,
                    quantity=item.quantity,
                    usd_price=item.usd_price,
                    usd_shipping_price=item.usd_shipping_price.to_eng_string(),
                )

                # add same shipping as origin:
                # for item2 in order.items:
                #     if item2.usd_shipping_price != Decimal('0.00'):
                #         new_order.item_set.create(
                #             name=item2.name,
                #             product=item2.product,
                #             quantity=item2.quantity,
                #             usd_price=item2.usd_price,
                #             usd_shipping_price=item2.usd_shipping_price,
                #         )

                # add standard shipping:
                new_order.item_set.create(
                    name=standard_shipping.title,
                    product=standard_shipping,
                    quantity=1,
                    unit_price=standard_shipping.base_price,
                    price=standard_shipping.base_price + standard_shipping.shipping_price,
                    usd_price=standard_shipping.usd_price,
                    usd_shipping_price=standard_shipping.usd_shipping_price,
                )

                new_order.add_note('Order created')
                new_order.add_note('OTG cable out of stock, original order %s' % order.token, False)

                # delete this old item:
                item.delete()

                # save both orders:
                new_order.save()
                order.save()

                order.add_note('OTG cable splitted from this order, created new order %s' % new_order.token, False)

                new_order.is_bulk = False
                new_order.save()

                print(i)
                i += 1
    print(csv)
