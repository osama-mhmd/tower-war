# Tower defense

## Game Rules

The rules are very simple:

1. Enemies come from the top entry, and walks through the path to reach the bottom out.

2. You should defend your castle and build towers, so preventing enemies from entering your castle

3. There are two main types of towers (until now); Rocket Tower, and Mega Tower

4. Also the game has waves. Each wave introduce a new level of difficulty. (we only have 6 waves until now)

## Join us

If you have any features to add or issues to fix, feel free to contribute, and make a PR.

- **Todo list** 🎯
- If reached 200, new level.. We have more textures to use. See `public/textures/`
- Add more sounds
- Make settings/effects-volume works
- Invisible enemies AND Flying enemies. See `public/textures/`
- Enhance performance (we are doing a lot of stuff per frame)

## How to join?

We are using Vite, ReactJS, and Zustand. The setup is very simple

1. First, run `git clone https://github.com/osama-mhmd/tower-defense`
2. Then, `pnpm i`
3. And that's it. `pnpm run dev`

Making a new feature

1. `git checkout -m "feature/[your-feature-name]"`
2. `git commit -m "[your-commit-message]"` (e.g. "feat: added more levels")
3. `git push -u origin [your-branch-name]`
4. Then make your pull request.

## Development

### Decisions

- How to load resources?

  - Use `import.meta.glob` from "vite"
  - Make a build script to make `resources.json` file
  - Make `resources.json` file

    I found that using `import.meta.glob` does make a very bad white screen at the first load. And when using vite you cannot make a build script to make `resources.json` file. So I chose to make the file manually. It's not the best solution but it works.
