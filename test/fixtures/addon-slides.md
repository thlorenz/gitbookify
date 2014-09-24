# What Is a Node.js Addon?

- any library that needs to access C/C++ functionality

# What Is a Node.js Addon?

- Node.js itself works like an addon
- ???

# Looking at Node.js

- embedds v8 to *run* JavaScript
- calls out to **libuv** to handle system calls
- additional libraries used for other tasks, i.e. **http-parser**

# fs module

- `/lib/fs.js` *binds* `/src/file.cc`

# fs module

```js
// fs.js
var binding = process.binding('fs');
```

# fs module

- allows creating 'fs' object in JavaScript land with methods like `readdir`
- calling `fs.readdir` calls C++ `ReadDir` passing along JS parameters in `args` array
