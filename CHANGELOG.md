# CHANGELOG

## 0.21.1

-   FIX - Get version from tag name on release build pipeline.

## 0.21.0

-   ADD - Adds port selection during connection.


## 0.20.6

-   FIX - Save ADB custom path when set it on ADBPathManager.

-   DOC - Added Info about strategy used by ADBResolver

-   DOC - Added GIFs section in documentation demostrating how install apk on device

## 0.20.5

-   FIX - Improved CI/CD for deploy in production, now only need change the version on tagname like prod-v0.20.5 this will build and send the version 0.20.5 to the Extensions.

## 0.20.4

-   NEW - Tests for apk fi
    le picker, including apk install use cases.

## 0.20.3

-   NEW - Feature that enable install apk on connected device (Only windows tested).

## 0.19.3

-   DOC - README links and layout (nothing important).

## 0.19.2

-   FIX - Change broken image links from README.md to working image links, for VSCode extensions.

## 0.19.1

-   FIX - Issue #13 when connect throws an error, showing error message.

## 0.19.0

-   NEW - Bump version for new feature `Custom ADB path picker`
-   NEW - ADB Path Picker able to select custom adb executable path
-   IMPROVED - Tests with `net-helpers` mocking the class
-   IMPROVED - CHANGELOG.md layout

## 0.18.3

-   IMPROVED - README.md layout

## 0.18.2

-   IMPROVED - New buy meacoffee.com button on README.md

## 0.18.1

-   NEW - Refactor at codebase with `plugin controllers` startegy.
-   NEW - Changed Folder structure.

## 0.18.0

-   NEW - Test cases for `adb-resolver` use cases.

-   NEW - Improve how extension search `ADB` in enviroment adding `adb-resolver` strategy.

-   FIX - Enviroment variables is now accessed directly from path.

## 0.17.2

-   FIX - for issue #7 removing necessity to close "Connecting to X" message

## 0.17.1

-   NEW - fully ci/cd enviroment, now new commits in master will be released to production on extensions.

## Past

-   OLD - Forbiden Changes
    ...
