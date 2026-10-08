# FF1C Hall of Fame

A responsive, data driven Hall of Fame for Friday F1 Championship, built with HTML, CSS, vanilla JavaScript, and JSON. It is ready to publish directly from the repository root on GitHub Pages; no build or server process is needed.

## Preview locally

Because browsers restrict `fetch()` from `file://` pages, serve this folder with any static file server, then open its local address. For example, with Python installed:

```sh
python3 -m http.server 8000
```

Visit `http://localhost:8000`. GitHub Pages serves the files over HTTP, so the data loads there as well.

## Add a championship

Edit `data/champions.json` and add one object per season/tier combination:

```json
{
  "season": 3,
  "tier": 1,
  "driversChampion": "DriverName",
  "constructorsChampion": "Team Name",
  "constructorDrivers": ["Driver One", "Driver Two"],
  "seasonDescription": "A short optional season or championship note."
}
```

The required fields are `season`, `tier`, `driversChampion`, `constructorsChampion`, and `constructorDrivers`. Optional fields `teamLogo` and `driverImage` are reserved for future artwork. The current cards use built in CSS team treatments and SVG trophy artwork, so no image link is required. Keep one record for each season and tier that has a championship result. The page derives the counts, filters, archive, and drivers' title totals from these records. A constructor title is not counted as a drivers' title.

The constructor card gets team colors from the team name class in `css/style.css`. Add a `.team-your-team-name` rule with a `--team-accent` color if you want a custom accent for a new constructor.

## Publish with GitHub Pages

1. Push this project to the repository's `main` branch.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select **main** and **/(root)**, then save.

`index.html` is at the repository root and all site paths are relative, so it works at a repository subpath. Add official FF1C identity artwork in `assets/` when available; the current wordmark, trophy, and team emblems are self-contained placeholders.

## Project files

- `index.html` — accessible page structure and sharing metadata
- `css/style.css` — visual identity and responsive layouts
- `js/app.js` — data loading, cards, filters, archive search, details dialog, and legends
- `data/champions.json` — official championship records
- `assets/ff1c-league.png` — supplied Friday F1 Championship league logo used in the page header, hero, and footer
- `assets/trophies/` — resized trophy photos used on the championship cards
- `assets/` — location for additional brand artwork

### Trophy image credits

- Drivers' trophy photo: [Raimond Spekking, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:F1_Drivers%27_World_Championship_trophy_(cropped).jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Constructors' trophy photo: [Mattbuck, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:MotorExpo_2014_MMB_07_Formula_One_Constructors%27_Trophy.jpg), [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/).

Both files are stored locally, resized for web delivery, and cropped with CSS when displayed. The footer also provides attribution links.
