# EqualTo SureSheet

EqualTo SureSheet lets you create and share spreadsheets using [cool URIs](https://www.w3.org/Provider/Style/URI). We
created this product to show what you can build with [EqualTo Sheets](https://sheets.equalto.com/),
[our](https://www.equalto.com) "Spreadsheets as a service for developers" platform.

Some notes on how EqualTo SureSheet works:

* When you share a SureSheet, the URL is guaranteed to _always_ open that same spreadsheet. If users modify the data in the
  spreadsheet, those changes will not persist after reloading the spreadsheet.
* Users can create _new_ share links at any time. Those links will always open the exact version of the spreadsheet visible
  when the share link was first created.
## Building

1. Get an [EqualTo Sheets](https://sheets.equalto.com/) license key.
2. Set `EQUALTO_SHEETS_LICENSE_KEY` in [.env](.env) to your EqualTo Sheets license key from step 1.
3. Run `docker compose up -d` to start the [MongoDB](https://www.mongodb.com/) replica set (port `27018`).
4. `npm install`
5. `npx prisma generate`
6. `npx prisma db push`
7. `npm run dev`.
8. Open http://localhost:3000/ in your browser.


## License

EqualTo SureSheet is [MIT licensed](LICENSE.md). Note that to deploy EqualTo SureSheet, you'll need a (freely available)
[EqualTo Sheets license key](https://sheets.equalto.com/).
