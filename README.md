# JabRef-Word-Addin
## Getting started
- Install [Node.js](https://nodejs.org/)
- Create .env file in the root directory containing the `HOST_API_URL` key

  e.g `API_HOST = "https://jabref-online.herokuapp.com"`
- Run `yarn install`



## Follow the following steps to start the local web server and install add-in.
### To test add-in in Word.
- Run `yarn start` in the root directory. This starts the local web server and opens Word with add-in loaded.
- In Word, open a new document, choose the Home tab, and then choose the Show Taskpane button in the ribbon to open the add-in task pane.

### To test add-in in Word on a browser.
- Open Office on the web. Using the Create option, make a document in Word. In this new document, select Share in the ribbon, select Copy Link, and copy the URL.
- In the root directory of office project files, open the .env file. Add a "DOCUMENT_URL" key. Paste the URL you copied as the value for the "DOCUMENT_URL" key. For example,
`DOCUMENT_URL=<URL>`
- In the command line starting at the root directory, run `yarn start:web`.
- You will see a second dialog box, asking if you wish to register an Office Add-in manifest from your computer. You should select Yes.
- Choose the Reference tab, and then click on the JabRef icon to open the add-in task pane.
<img width="1332" alt="Screenshot 2021-06-19 at 4 08 31 PM" src="https://user-images.githubusercontent.com/62339705/122639736-334cf080-d119-11eb-9232-4b6e61d0147a.png">



### To sideload Add-in in Office on the web manually
- Open Office on the web. Open a document in Word. On the Insert tab on the ribbon in the Add-ins section, choose Office Add-ins.
- On the Office Add-ins dialog, select the MY ADD-INS tab, choose Manage My Add-ins, and then Upload My Add-in.
- Browse to the add-in manifest file, and then select Upload.
- Choose the Reference tab, and then click on the JabRef icon to open the add-in task pane.


## Commands

| Command | Description |
|---------|-------------|
| yarn start | To test add-in in Word, run this command in the root directory. This starts the local web server and opens Word with add-in loaded.|
| yarn start:web | To test your add-in in Word on a browser, run this command in the root directory. When you run this command, the local web server will start|
| yarn build | To start server in production. |

Note: If you're testing add-in on Mac, run `yarn dev-server` to start the local web server.

## Recommended VS Code Extension
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Format code and enforces consistent style.

## Technologies used
- [React.js](https://reactjs.org): UI framework [Documentation](https://reactjs.org/docs/getting-started.html)
- [Microsoft Office Add-in](https://docs.microsoft.com/en-us/office/dev/add-ins/)
