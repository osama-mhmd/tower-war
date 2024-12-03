# Tower defense

## Development

### Decisions

- How to load resources?

  - Use `import.meta.glob` from "vite"
  - Make a build script to make `resources.json` file
  - Make `resources.json` file

    I found that using `import.meta.glob` does make a very bad white screen at the first load. And when using vite you cannot make a build script to make `resources.json` file. So I chose to make the file manually. It's not the best solution but it works.
