# Plugna

**Plugna** is a WordPress plugin that simplifies the management of other plugins. It provides a single page for managing all plugins on your website, allowing you to easily activate, deactivate, update, or delete plugins, as well as install and activate new plugins - all without having to refresh the page.

It's a plugin manager that is built on top of the original WordPress plugins page, to reuse its complexity and security but with the improved user experience.

You can switch back to the original plugins page whenever you need it.

Download the latest version from the [WordPress Plugin Directory](https://wordpress.org/plugins/plugna/).

## Commands

### Initialize

First, install the dev project's dependencies.

```shell
yarn
```

### Development - watcher

Run the development watcher, and it will automatically compile the assets when you make changes to the source files.

```shell
yarn dev
```


### Production build of CSS/JS

Run this command to build the production assets.

```shell
yarn prod
```


### Pack for production

This single command will compile the assets, run the production build, and then pack the plugin into a zip file.
You can find the production-ready build in /export directory after running this command.

```shell
yarn packit
```

### Cleanup of the export directory

This command will remove all files from the export directory.

```shell
yarn clean
```