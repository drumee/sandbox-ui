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

module.exports = function (_ui_, opt = {}) {
  const { service, content } = opt;
  const a = Skeletons.Box.Y({
    className: `${_ui_.fig.family}__launch-pad`,
    kids: [
      Skeletons.Wrapper.Y({
        className: `${_ui_.fig.family}__launch-pad-button`,
        sys_pn: 'launch-pad-button',
        kids: [
          Skeletons.Note({
            active: 0,
            className: `progress`,
            content: "",
            sys_pn: "progress"
          }),
          Skeletons.Note({
            className: `text`,
            content,
            service,
            sys_pn: "launcher",
            haptic: 1
          }),
        ]
      })
    ]
  });
  return [a];
}
