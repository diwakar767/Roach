# Using Roach

Open the site, by default [http://localhost:8080](http://localhost:8080). Two kinds of accounts exist: a shop, and the operator who runs this deployment.

Set the operator email and password in `.env` before the first start. The sample values are in [.env.example](../.env.example): `admin@example.com` and `change-me-admin`. Change them there, then run `docker compose up --build`. That password is stored when the operator account is created. Later changes belong on Edit Profile, unless you remove the database volume and let startup create the account again.

## Shop

### Create the shop

1. Open the home page and choose Register.
2. Enter a name, email, and a password of at least 6 characters.
3. You land on the dashboard. The shop can work for 30 days from this moment.

Sign in later from Login. The session lasts one day. Logout is in the header.

If the trial has ended and nobody has recorded a payment, sign-in still works and the only page is Access is paused. Your products and invoices are still stored. Pay the operator in person. After they record it, sign in again.

### Products

Dashboard shows how many products you have, what the stock is worth at selling price, how many are out of stock, and how many categories you have used. The list below can be filtered in the page.

Add Product asks for:

- A picture, from a file or from Use camera.
- Name, category, selling price, cost, quantity, and reorder level.
- Description, benefits, and use cases. Benefits and use cases can stay empty.

Save returns to the dashboard. Open a product for the stored detail, the QR code, and a link to restock or sell. Edit Product changes the same fields. Changing the quantity there is recorded as a stock adjustment. Delete removes that product.

The SKU is chosen for you from the category and the time you save.

### Labels, restock, and selling

On the product page, Download QR saves a PNG. The code points back at this site and that product. Stick it on the shelf or the box. Anyone who can open your site while you are signed in can use it. It does not let another shop change your stock.

Scan opens the camera. Point it at a Roach QR code. If the browser cannot use the camera, type the name or SKU in the search box and open the product.

On the stock page:

- Restock: units to add, an optional note, and an optional new photo. Add stock increases the quantity on hand.
- Checkout: units to sell, then Add to checkout. You can scan further products and add them too. Review checkout shows the cart. Change a quantity, remove a line, add a note, and confirm. You cannot sell more than the quantity on hand.

Confirming the sale reduces stock and opens the invoice. The invoice shows each line, revenue, cost, and profit. Profit uses the cost stored on the product at sale time.

### Alerts

The bell in the header counts unread alerts.

- Low on stock: quantity is above zero and at or below the reorder level.
- Out of stock: quantity is zero.

Open goes to that product and marks the item read. Read all marks the list read. Clear all removes the list. Raising the quantity above the reorder level does not by itself delete an old alert. The next alert of that kind appears after the earlier one has been read or cleared.

If the operator has set SMTP, you also get the same words by email. If email is not set, the bell is still the record.

### Reports

Reports adds up every invoice for this shop: units sold, revenue, cost, and profit. Under that are the newest invoices and the newest stock movements (restock, checkout, and edits to quantity). Open an invoice for its lines.

### Profile and Report Bug

Account, then Profile or Edit Profile, changes name, phone, bio, photo, and password. Email stays the address you registered with.

Report Bug sends a subject and message to the operator's mailbox. It works only when the operator has filled in `EMAIL_HOST`, `EMAIL_USER`, and `EMAIL_PASS`. Otherwise the page says email services are not available. The same is true for Forgot Password. The contact details printed beside the form are placeholders.

## Operator

Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`. The sidebar shows Admin. Your own access does not expire, and the Admin page will not block you.

The table lists every account: name, email, status, trial end, and paid-through date.

| Status | Meaning |
| --- | --- |
| `trial` | Inside the free 30 days, and no current paid-through date beyond that. |
| `active` | Paid-through date is still in the future. |
| `blocked` | Trial and paid-through date are both in the past. Data is still there. |
| `admin` | The operator account. |

Record payment asks for months (default 1), an optional amount, and an optional note. Amount is a note of what you received in person. Roach does not charge a card. The shop's paid-through date becomes that many months after the later of today, their current paid-through date, and their trial end.

Block now ends access immediately. Sign-in still works. The shop sees Access is paused. Products, invoices, movements, and photos are not deleted. Record a payment later to open the shop again.

You can also use Dashboard, Scan, and Reports as a shop of your own. Those records belong to the operator account, not to the shops in the Admin table.

## Email on this deployment

Leave the email variables empty and the rest of Roach works. Fill all three, then recreate the containers, when you want:

- password reset mail
- Report Bug mail
- a copy of each new stock alert

Stock alerts are stored for the bell either way.

## Phone or another computer

Use the address of the machine running Compose, not `localhost` on the phone. The phone browser can scan QR codes and take product photos when it can open that address. The QR code stores the origin of the site that drew it, so generate the label from the address people will actually open.
