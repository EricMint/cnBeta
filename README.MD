# 施工微信小程序项目

# Directory Structure
```
root/
 ├──lib/                           * third party library (pass lint)
 │
 ├──pages/                         * page component
 │   └──index/                     * index page component
 │       ├──index.js               * index page component - js file
 │       ├──index.json             * index page component - json config
 │       ├──index.wxml             * index page component - wx html
 │       └──index.wxss             * index page component - wx css
 │
 ├──utils/                         * common utils component
 │
 ├──app.js                         * main app component - js file
 ├──app.json                       * main app component - json config
 ├──app.wxss                       * main app component - wx css
 ├──package.json                   * what npm uses to manage it's dependencies
 └──README.MD                      * HERE AM I
```

# Getting Started
## Dependencies
What you need to run this app:
* `node` and `npm`
* Ensure you're running the latest versions Node `v4.x.x`+ (or `v5.x.x`) and NPM `3.x.x`+

## Installing
* `npm install` to install all dependencies
* `npm install -g mocha` to install mocha test framework globally

### build files
* `npm run lint` to run code quality tools
* `npm test` to run unit test
