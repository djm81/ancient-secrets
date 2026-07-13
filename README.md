# The Maestro's Secret

A compact Renaissance point-and-click adventure set in Florence in 1503. You play Leonardo da Vinci's apprentice, following a trail of mirror writing, mechanisms, locked boxes, and hidden curiosities to find the missing Maestro.

[Play the game on GitHub Pages](https://djm81.github.io/ancient-secrets/)

## Highlights

- One self-contained HTML game: illustrated SVG scenes, responsive layout, inventory, dialogue, sound effects, and generative lute music.
- Replayable mysteries: every new chronicle randomizes the strongbox code, its Roman-numeral clue location, the Piazza gear route, and the Duomo bell sequence.
- A nested Il Duomo adventure: solve the vestibule's star-and-bell lock to reach the Whispering Gallery and its alternate clue path.
- Five optional curiosities reward close observation without blocking completion.

## Point-and-click design

The game borrows the readable visual language of classic point-and-click adventures: hotspots identify objects worth examining, the satchel lets players select and apply items, and short contextual dialogue nudges rather than spells out solutions. Item puzzles have been adjusted for a small web game: their state is visible in the scene, wrong attempts are safe, and the main paths are compact enough for a short session.

Randomized routes add variety without making a run opaque. A player still learns the same core verbs—look, take, combine, and interpret clues—but the required order and the place that reveals the lock code can change.

## Possible next additions

- Save/resume a current chronicle in browser storage.
- Add multiple endings based on curiosities and puzzle choices.
- Expand the Duomo with further rooms, character conversations, and alternate items.
- Add keyboard navigation and a high-contrast accessibility mode.

## Publish with GitHub Pages

The included workflow builds the repository with Jekyll and deploys it whenever `main` is pushed. In the repository’s **Settings → Pages**, choose **GitHub Actions** as the source once. The site root then launches the game automatically through `index.html`; no filename needs to be added to the URL.

To preview locally, open `maestros-secret.html` in a browser. The root launcher is intended for GitHub Pages and redirects to the game file.
