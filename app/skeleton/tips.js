// ======================================================= *
//   Copyright Xialia.com  2011-2024
//   FILE : /Users/somanos/devel/sandbox-ui/app/main/skeleton/index.js
//   TYPE : Skelton
// =========================================================**/
const { filesize } = Drumee.utils();

function tips(_ui_, key) {
  let title = LOCALE[key];
  let text = LOCALE[`${key}_TIPS`]
  return Skeletons.Box.Y({
    className: `${_ui_.fig.family}__tips container`,
    kids: [
      Skeletons.Note({
        className: `${_ui_.fig.family}__tips title`,
        content: title
      }),
      Skeletons.Note({
        className: `${_ui_.fig.family}__tips text`,
        content: text
      }),
    ]
  })
}
/**
 * 
 * @param {*} _ui_ 
 * @returns 
 */

function __skl_sandbox_tips(_ui_) {
  let { private_hub, share_hub, team_call, disk } = _ui_.quota || {};
  disk = filesize(disk);
  team_call = Dayjs.duration(team_call, 'seconds').$d.minutes;

  const a = Skeletons.Box.Y({
    className: `${_ui_.fig.family}__container`,
    kids: [
      require("./languages")(_ui_),
      Skeletons.Note({
        className: `${_ui_.fig.family}__main-title`,
        content: LOCALE.SBX_INTRO_TITLE
      }),
      Skeletons.Note({
        className: `${_ui_.fig.family}__main-text`,
        content: LOCALE.SBX_INTRO_SUBTITLE
      }),
      tips(_ui_, "SBX_FILE_MANAGER"),
      tips(_ui_, "SBX_INTERNAL_SHARE"),
      tips(_ui_, "SBX_EXTERNAL_SHARE"),
      Skeletons.Box.Y({
        className: `${_ui_.fig.family}__warning container`,
        kids: [
          Skeletons.Note({
            className: `${_ui_.fig.family}__warning title`,
            content: LOCALE.WARNING
          }),
          Skeletons.Note({
            className: `${_ui_.fig.family}__warning text`,
            content: LOCALE.SBX_USAGE_TIPS
          }),
          Skeletons.Note({
            className: `${_ui_.fig.family}__warning text`,
            content: LOCALE.SBX_LIMITATIONS.format(disk, team_call, private_hub, share_hub)
          }),
        ]
      }),
      Skeletons.Note({
        className: `${_ui_.fig.family}__main-text usage-condition`,
        content: LOCALE.SBX_ACCEPT_CONDITIONS
      }),
    ]
  });

  return [a];
}
module.exports = __skl_sandbox_tips;