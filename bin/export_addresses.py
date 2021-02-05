#!/usr/bin/env python
import os
import sys


if __name__ == "__main__":
    sys.path.append('../')
    sys.path.append('.')
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_eshop.settings")

    from project_eshop.users.models import Address
    from project_eshop.shop.models import Order

    csv = ''

    orders = Order.objects.filter(
        # transaction_status=Order.PAID,
        # order_status=Order.SHIPPED,
        is_bulk=True,
    )

    addresses = dict()
    emails = dict()
    for order in orders:

        if order.address.id not in addresses:
            addresses[order.address.id] = list()
            emails[order.address.id] = list()

        addresses[order.address.id] = order.user_email
        # emails[order.address.id] = order.user_email

    for address_id in addresses:
        address = Address.objects.get(pk=address_id)
        csv += addresses[address_id] + ';'
        csv += address.vat_id + ';' if address.vat_id else ';'
        csv += address.company_name + ';' if address.company_name else ';'
        csv += address.full_name + ';'
        csv += address.street + ';'
        csv += address.street2 + ';'
        csv += address.city + ';'
        csv += address.state + ';'
        csv += address.postal_code + ';'
        csv += str(address.country.code) + ';'
        csv += address.phone + ';' if address.phone else ''
        csv += '\n'

    print(csv)
