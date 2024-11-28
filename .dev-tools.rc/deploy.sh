# This file is used by @drumee/ui-dev-tools to sync app changes to the app server
# There are three ways to update changes

# On the same host 
# export DEST_DIR=/path/to/your/app/dist

# On a remote host using ssh
# export UI_RUNTIME_HOST=your.app.host
# export DEST_DIR=/path/to/your/app/dist

# Using Drumee Desktop 
# export DEST_DIR="$HOME/DrumeeLocal/your.drumee.instance/your-ident/app-directory"
export BUILD_TARGET=app
export PUBLIC_PATH=/app/
export ENTRY_PAGE=/index.html
export OUTPUT_FILENAME="[name]-[fullhash].js" # [name].js

# To deploy changes, use `npm run deploy`