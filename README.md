# import-inspector

The tool consists of three parts:

```
┌──────────────┐     imports      ┌────────────────┐
│    Core      │ ◄─────────────── │    Settings    │
└──────┬───────┘                  └────────┬───────┘
reads  │                                   │ points to
       ▼                                   │
┌──────────────┐                           │
│    Config    │ ──────────────────────────┘
└──────────────┘
```

- **Core** - the engine, written on Deno. It reads the config, imports the settings file, and performs the analysis:
  collects project files, resolves every import into a real module path, builds the module graph, lints it against the
  rules, and outputs the results - terminal summary and HTML reports.

- **Config** - a JSON file with presets. A preset consists of this information: the project to analyze (project path)
  and the settings file that describes it (settings path).

- **Settings** - a configuration entry point file, imported and executed by the core at runtime. It carries everything
  project-specific: which directories to scan (root entries), aliases, etc.

## Features

### Analysis

- **Packages** - files grouped by directories, with a hierarchy of nested packages and an index entry point file that
  defines the public surface of a package.
- **Imports and exports** - full information about them: external (bare locators) and internal (resolved project paths),
  dynamic, and values (what an import takes from a module, and what a module exposes).
- **Links** - references between modules: for every module, the modules which import it.

### Rules

- **Linting** - built-in rules and custom rules, extensible with defect suppression.
- **Dynamic import corrections** - a settings hook that resolves `import(...)` locators a static resolver cannot.

### Marking

- **Tags** - labels attached to modules; useful for grouping different files by some criteria to improve their analysis.
- **Frames** - logical groups of modules, as opposed to packages which group them physically.

### Extending

- **Flexible configuration** - presets in one config file in a defined place, with the settings module selecting all
  project details.
- **Custom reports** - write HTML reports with the predefined htmlx components.
- **Custom tasks** - build CLI tasks with the predefined tuix widgets.

## How to configure

The configuration is stored in the user folder (`~/.config/import-inspector`), in the config file
(`~/.config/import-inspector/config.json`). It has the following format:

```json
{
	"presets": {
		"<preset-name>": {
			"settingsPath": "an absolute path to a settings file for the preset",
			"projectPath": "an absolute path to the analyzed project"
		}
	}
}
```

Both values are required, and the settings file must exist.

The easiest way to create and edit the config is the `configure` command. It opens an interactive editor with actions to
create the config, and to add, update, or remove presets - every value is validated on input.

## Commands

- `help` - show the commands and the config locations.
- `lint [--preset <name>]` - lint project files.
- `task <name> [...args] [--preset <name>]` - run a task defined in the settings file.
- `list-tasks [--preset <name>]` - list available tasks.
- `configure` - create and edit presets interactively.
- `version` - show the version.
- `write-api-file [dir]` - write the types file `api.d.ts` into the directory (default: current).

The `<name>` option of `--preset` selects a preset from the config; the default preset is used when the option is
omitted.

## The api.d.ts file

All the public types of the core are published in one file -
[api.d.ts](https://github.com/evandvlad/import-inspector/blob/main/src/api.d.ts): type definitions for the settings
module and everything referable from it (tasks, reports, hooks), and others. A `write-api-file` command writes this file
into the selected directory (the default: the current directory).
