# DoL Remote Save

This Project provides an easy to use extension for Dol (Degrees of Lewdity) to allows the player to save their game to a remote server.

## How to Build

### Build

Building this extension can easily be done using npm. To do that, run the following npm commands:

- Install all dependencies (only has to be done once).
  ```
  npm install
  ```

- Build the Typescript project
  ```
  npm run build
  ```

- Prepare all files for distribution
  ```
  npm run dist
  ```

### Clean

To clean up the project for a clean build, run the following:
  ```
  npm run clean
  ```

## Installation

### Install as the only extension of this type

To use this extension, follow these steps to add it to a clean DoL game. Clean in this case means, no other extensions with this framework are used.

- Copy the contents of the [dist folder](./dist/) to the DoL folder

- Edit the `index.html` file using any text editor
  - Find the `iframe`-element with the id `dolEmbedded`
  - Edit the `src`-attribute to point the the original game file (usually only the version needs to be adjusted)
  - Save the file

### Install as additional extension

If the game already has an extension with this framework, installation of this extension becomes a little bit harder.

- Copy the [ryanshy](/dist/ryanshy/) and [ryanshyStyle](/dist/ryanshyStyle/) folders to the DoL folder.

- The [index.html](/dist/index.html), [index.css](/dist/index.css) and [package.json](/dist/package.json) files should already be in the modified game folder.
  - if not: copy the missing files as well, though it is more likely that the game does not have an extension of this framework.
  - if the [index.html](/dist/index.html) was missing, it definitely did not have an extension of this framework. After copying all files, the extension is now fully installed. (See [here](#install-as-the-only-extension-of-this-type))

- Edit the `index.html` file using any text editor
  - In the `<body>`-section of the html file, add the following line:
  ```html
  <script src="/ryanshy/index.js" async defer></script>
  ```
  - Save the file

## Server Setup

An example of a server can be found in [/server/server.py](/server/server.py).

### Requirements

To run the server in its intended form, it needs to be run on **Linux** as some of its dependencies do not exist on Windows. Therefore, all steps described here in the [Server Setup](#server-setup) assume that Linux is used!

The example was designed using [Bottle](https://bottlepy.org/docs/dev/) and [gunicorn](https://gunicorn.org/). As such, python3 is also required.

For TLS encryption, the free certificate from [letsencrypt](https://letsencrypt.org/) is used. When using the server as provided, all of these dependencies are required, though other equivalents also exist.

### Preparation

In order for it to work, some things need to be adjusted. If run on a public server change the following:

- change the `your_domain` variable to the domain used to obtain the `letsencrypt` certificate.
- in the `main()`-function, swap the run function call by commenting the lower and uncommenting the upper call. i.e. change it from
  ```python
    # run bottle
    #run(app=app, host='0.0.0.0', port=8089, server='gunicorn', keyfile=f'/etc/letsencrypt/live/{your_domain}/privkey.pem', certfile=f'/etc/letsencrypt/live/{your_domain}/fullchain.pem', accesslog='-')
    run(app=app, host='0.0.0.0', port=8088)
  ```
  to
  ```python
    # run bottle
    run(app=app, host='0.0.0.0', port=8089, server='gunicorn', keyfile=f'/etc/letsencrypt/live/{your_domain}/privkey.pem', certfile=f'/etc/letsencrypt/live/{your_domain}/fullchain.pem', accesslog='-')
    #run(app=app, host='0.0.0.0', port=8088)
  ```

If run locally for testing, no changes are required.

### Creating a user

The REST API does not offer a method to create a user, so that has to be done manually. The [server.py](/server/server.py) does offer this functionality though.

Therefore, creating a user can be done by opening the `python3` repl. On Linux this would look something like this:

1. Open a terminal in the server folder
1. type `python3` in the terminal and press enter
  - this should open the python3 repl
1. import the server.py file by typing `import server`
  - if no db existed, this will automatically create one on importing the script
1. if no database existed before, the correct tables need to be created first by using the `createTables()`-function
  - i.e. `server.createTables()`
1. create the user in the database using the `create_base_user(username, password)`-function of the server
  - i.e. `server.create_base_user("RyanShy", "password1234")`
1. repeat the above step for each user
1. when all users have been created exit the repl by typing `exit()` and pressing enter

### Running the Server

To run the server, simply launch `python3` in the server folder with `server.py` as argument.

It can also be automatically started by creating a systemd service. Just make sure to set the execution directory correctly.

## How to Use

To use the extension, both the [installation](#installation) as well as the [server setup](#server-setup) needs to be completed.

### Launching the Extension

To start the game with the extension, open the `index.html` in the browser / webview of choice.

> **NOTE**: Most browsers block Cors between files, so using webviews like `nw.js` with the option `"chromium-args": "--allow-file-access-from-files"` is highly recommended.

### Using the Extension

The extension adds a singular button on the save menu, prefixed with `RyanShy Save Menu` and the label `Open Menu`.
By pressing this button, an overlay is opened. On first use, a toast message will appear stating, that a login is required.
To log in, simply press the `Login`-tab, enter the server address including the port, as well as username and password. Then press the `Login`-button at the bottom.
A toast message will inform you, if the login was successful or not. On successful login, the browser / webview will store your login information and the extension can now be used.

### Changing Password

If the server was set up by someone else, it is a good idea to change the password. To do that, open the settings tab after logging in. Enter a new password and press the `Change Password`-button.

### Saving and Loading

To create a new save, simply enter a ID/Name and press the `Save`-button. Note that, if the button is disabled, it is likely that saving is disabled on the current passage.

After creating a save, the List should automatically update and display all saves of the current user. Saves can be overwritten by pressing the `Save`-button of the corresponding row. To load a save, press the `Load`-button of the corresponding row.

### Deleting

By default, the server limits the number of saves per user to `100`. If the limit is reached, old saves need to be deleted before a new save can be created.

To delete a save simply press the `Delete`-button of the corresponding row.

> **WARNING**: When pressing this button, the save will be deleted forever. **There is no undo!**

## Extension Framework

This extension wraps the base game with an `iframe`-element. The framework aims to allow multiple extensions like this one to work simultaneously.

An extension should load all its content using a single script. This allows easy management of extensions and helps mitigating collisions. An example of what adding a script should look like is here:
```html
<script src="/ryanshy/index.js" async defer></script>
```

- **DOM-Elements**:<br>
DOM-Elements should be prefixed with a somewhat unique identifier. This could be the extensions name or the name of the creator. Using a random string of characters is also a valid choice.
- **Adding CSS**:<br>
CSS files should be loaded dynamically from the init script by creating a `link`-element using the DOM and setting the href attribute to the file location. The element should be added as a child of the documents head.
- **Adding JS**:<br>
If the extension should makes use of several Javascript files, they can be added using the init script. They can be linked using a `script`-element created using the DOM and added as a child of the documents head.
- **Adding HTML**:<br>
HTML elements can be added using either of the following methods:
  - Creating an `iframe`-element using the DOM and linking the HTML file.
  - Creating the HTML elements directly in the DOM using Javascript.


## About this Extension

### Server

Here is some extra documentation on the server:

#### REST API

**TODO** Document the Rest API

#### Security Concerns

The server as implemented uses `Basic Auth`, transmitting the password and username using only base64 encoding. This is **only save when using TLS encryption!** Therefore the server should never be run using unencrypted `http` but only using `https`. If the REST API server does not support `https`, do not expose it directly to the internet but rather hide it behind a reverse proxy with `https`.

