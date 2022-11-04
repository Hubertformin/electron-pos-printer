# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a
   build.
2. Update the README.md with details of changes to the interface, this includes new environment
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of at least one developer, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Getting Started

First fork and clone the repo:
````bash
git clone git@github.com:your-username/electron-pos-printer.git
````

Then run ``npm install`` to set everything up. 
You are now ready to start doing your changes.


## Development
The source code lives in the `src` folder. The src folder has two sub-folders, `main` for the main process code
and `renderer` for the render process code.  <br />
Run your code with the command `npm start` which creates a demo electron instance. The code in demo folder imports the 
plugin locally, you can modify the contents of this folder however you want

## Building
To ensure your code has a valid syntax, please build before you push to github.
```bash
npm run build
```