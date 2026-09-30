# Data flow

These diagrams match the running system. A shop only reads and writes its own records. The operator is the admin account for this deployment. SMTP is used only when `EMAIL_HOST`, `EMAIL_USER`, and `EMAIL_PASS` are all set.

## Context

```mermaid
flowchart LR
  shopUser[ShopUser]
  operator[Operator]
  roach[Roach]
  mongo[MongoDB]
  files[UploadStorage]
  smtp[SMTP]
  shopUser -->|"uses the site"| roach
  operator -->|"records payments and blocks access"| roach
  roach -->|"accounts, stock, invoices, alerts"| mongo
  roach -->|"product and profile images"| files
  roach -->|"reset, bug report, stock email"| smtp
```

Upload storage is the `uploads_data` volume, or Cloudinary when all three Cloudinary variables are set.

## Level 1

```mermaid
flowchart TD
  shopUser[ShopUser]
  operator[Operator]
  auth[Authenticate]
  catalog[MaintainProducts]
  stock[MoveStock]
  alerts[RaiseAlerts]
  billing[RecordAccess]
  reports[SummarizeSales]
  store[(MongoDB)]
  smtp[SMTP]
  shopUser --> auth
  shopUser --> catalog
  shopUser --> stock
  shopUser --> reports
  operator --> auth
  operator --> billing
  auth --> store
  catalog --> store
  stock --> store
  stock --> alerts
  catalog --> alerts
  alerts --> store
  alerts --> smtp
  billing --> store
  reports --> store
  auth --> smtp
```

Paused shops still pass Authenticate. Maintain products, move stock, read reports, read alerts, and Report Bug stop until Record access extends them.

## Sign in and session

```mermaid
flowchart TD
  form[LoginForm]
  api[LoginRoute]
  users[(User)]
  cookie[SessionCookie]
  gate[AccessCheck]
  app[ShopScreens]
  paused[PausedPage]
  form -->|"email and password"| api
  api -->|"find account and compare hash"| users
  api -->|"httpOnly cookie for one day"| cookie
  cookie --> gate
  gate -->|"trial, paid, or admin"| app
  gate -->|"access ended"| paused
```

Register writes the user, sets the trial end to 30 days ahead, and sets the same cookie. Logout clears the cookie. Forgot password, when SMTP is configured, stores only a hash of the reset token and emails the raw token. The link expires after 30 minutes.

## Product and stock

```mermaid
flowchart TD
  form[ProductForm]
  camera[CameraStill]
  api[ProductRoute]
  products[(Product)]
  movements[(StockMovement)]
  form --> api
  camera -->|"png or jpeg"| form
  api -->|"create or update"| products
  api -->|"quantity edit"| movements
```

Quantity on the edit form is an adjustment. Create and update also ask the alert step to look at the new quantity.

## Scan, restock, and checkout

```mermaid
flowchart TD
  label[QrLabel]
  scan[ScanPage]
  search[NameOrSkuSearch]
  sheet[StockPage]
  cart[CheckoutCart]
  api[StockRoute]
  products[(Product)]
  movements[(StockMovement)]
  invoice[(Invoice)]
  alerts[RaiseAlerts]
  label -->|"origin and product id"| scan
  search --> sheet
  scan --> sheet
  sheet -->|"units to add, optional photo"| api
  sheet --> cart
  cart -->|"lines and note"| api
  api -->|"increase or decrease quantity"| products
  api --> movements
  api -->|"one invoice per checkout"| invoice
  api --> alerts
```

The QR text is the site origin plus `/scan/` and the product id. The scan page can ignore the camera and open the same stock page from search. Checkout refuses a line whose quantity is greater than the quantity on hand. The cart itself is kept in the browser until the sale is confirmed.

## Alerts

```mermaid
flowchart TD
  change[StockChange]
  rule[CompareWithReorderLevel]
  notes[(Notification)]
  bell[HeaderBell]
  mail[SMTP]
  change --> rule
  rule -->|"quantity is zero, or at or below the level"| notes
  notes --> bell
  notes -->|"only when SMTP is set"| mail
```

One unread notification of each type is kept per product. Opening an item marks it read. Read all marks the shop's list read. Clear all deletes that list. A failed email does not remove the bell item and does not undo the stock change.

## Access and payment

```mermaid
flowchart TD
  register[Register]
  users[(User)]
  admin[AdminPage]
  payments[(Payment)]
  gate[AccessCheck]
  paused[PausedPage]
  register -->|"trial end is 30 days ahead"| users
  admin -->|"months, amount, note"| payments
  admin -->|"paid-through date"| users
  admin -->|"block clears paid-through and ends the trial"| users
  users --> gate
  gate --> paused
```

The paid-through date is the chosen number of months after the later of today, the current paid-through date, and the trial end. Block does not delete products, invoices, movements, notifications, or files. The operator account is not blocked and does not expire.
