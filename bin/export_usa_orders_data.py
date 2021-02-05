#!/usr/bin/env python3
# Exports data from orders shipped to United States in March, 2014, generates invoice PDFs

# howto run:
# ./manage.py shell
# exec(open('bin/export_usa_orders_data.py').read())

from os import path, makedirs
from sys import stdout, stderr, exit
from pdfkit import from_string as pdf_from_string
from tarfile import open as topen
from shutil import rmtree as rm_dir_and_contents
from signal import signal, SIGINT
from functools import partial

from project_eshop.shop.models import Order


def trap_sigint(path, signum, frame):
    print('\nTrapped SIGINT, wiping the "' + path + '" directory...')
    rm_dir_and_contents(path)
    print('Done!')
    exit(0)


def main():
    export_path = 'invoices'
    if not path.exists(export_path):
        makedirs(export_path)

    orders = Order.objects.filter(
        address__country__name__contains="United States",
        order_status=Order.SHIPPED, 
        shipped_date__year=2014, 
        shipped_date__month=5
    )

    print('Total orders matching query: ' + str(len(orders)) + '.')

    signal(SIGINT, partial(trap_sigint, export_path))

    with open(export_path + '/usa_shipped_orders.csv', 'w') as out:
        out.write(';'.join(['Order ID', 'Full Name', 'Address', 'Tracking Number', 'Invoice Number']) + '\n')
        usa_orders_count = 0

        for o in orders:
            usa_orders_count += 1
            address = ', '.join(filter(None,[o.address.street, o.address.street2, o.address.street3, o.address.city, o.address.postal_code, o.address.state, o.address.country.name]))
            invoice_no = 'P' + o.created.strftime('%y%m%d') + str(o.id % 10000).zfill(4)
            tracking_number = '--' if (o.tracking_number is None or o.tracking_number == '') else o.tracking_number
            csv_row = ';'.join([str(o.id), o.address.full_name, address, tracking_number, invoice_no]) + '\n'
            stdout.write(csv_row)

            out_path = export_path + '/invoice-' + invoice_no + '.pdf'
            pdf_from_string(o.get_invoice_as_string(), out_path, options={'quiet': ''})

            out.write(csv_row)

    print('\nTotal USA orders: ' + str(usa_orders_count))

    tarball = 'usa_order_data.tar.gz'
    with topen(tarball, "w:gz") as tar:
        tar.add(export_path, arcname=path.basename(export_path))

    rm_dir_and_contents(export_path)
    print('Added files to "' + tarball + '" archive in the current directory.')


if __name__ == "__main__":
    main()
else:
    stderr.write("You can't import " + path.basename(__file__) + ' as a module, try executing it directly.')
