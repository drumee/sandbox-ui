// ================================================================== *
//   Copyright Xialia.com  2011-2024
//   FILE : /Users/somanos/devel/sandbox-ui/app/main/skeleton/index.js
//   TYPE : Skelton
// ===================================================================**/

/**
 * 
 * @param {*} _ui_ 
 * @returns 
 */

function __skl_sandbox_app(_ui_) {
  const opt = {
    service: _e.start,
    content: LOCALE.SBX_START
  }
  const a = Skeletons.Box.Y({
    className: `${_ui_.fig.family}__main`,
    kids: [
      Skeletons.Box.Y({
        className: `${_ui_.fig.family}__body`,
        debug: __filename,
        sys_pn: _a.content,
        kids: require("./tips")(_ui_)
      }),
      Skeletons.Wrapper.Y({
        className: `${_ui_.fig.family}__footer`,
        sys_pn: "footer",
        dataset: {
          state: _a.closed
        },
        kids: require("./launch-pad")(_ui_, opt)
      })
    ]
  })
  return a;
}
module.exports = __skl_sandbox_app;
