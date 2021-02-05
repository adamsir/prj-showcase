#!/usr/bin/env python
import os
import sys


if __name__ == "__main__":
    sys.path.append('../')
    sys.path.append('.')
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project_eshop.settings")

    from project_eshop.users.models import Transaction
    from datetime import datetime

    datum = datetime(2017, 11, 11)

    tra = Transaction.objects.exclude(payout_address=None)
    tra = tra.filter(created__gte=datum)

    tra = tra.order_by('-created')
    csv = ''

    for tr in tra:
        csv += "\n" + str(tr.user.email) + ';' + str(tr.created) + ';' + str(tr.payout_address) + ';' + str(tr.amount)

    print(csv)
