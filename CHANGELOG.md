# Changelog
All notable changes to this project will be documented in this file.

## [0.1.0] - 2017-06-09
### Added
- Support for Webpack's `--env` option, allowing to pass custom params.

### Changed
- Use Webpack's `--env` option instead of `NODE_ENV` as primary method for setting the environment.
- `.getConfig()` method now returns a fat arrow function which receives Webpack's `--env` option.
- `env` option now accepts an `Object`.
- `commonEnvName` option is now `commonEnvId`.

[0.1.0]:https://github.com/MtDalPizzol/webpack-envy/releases/tag/0.1.0
