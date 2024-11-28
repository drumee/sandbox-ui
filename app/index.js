/* ======================================================== *
*   Copyright xialia.com  2011-2021
* ========================================================= */
const { copyToClipboard } = Drumee.utils();
class ___sandbox_app extends LetcBox {

  /**
   * 
   */
  initialize(opt = {}) {
    require('./skin');
    super.initialize(opt);
    this.declareHandlers();
    const lang = require('./locale')(Visitor.language());
    LOCALE = { ...LOCALE, ...lang };
    LOCALE.__currentLanguage = lang;
    LOCALE.INTRO_POPUP_TITLE = LOCALE.SBX_INTRO_TITLE;
    this.mset({
      flow: _a.y,
      lang: Visitor.language(),
    })

  }

  /**
   * 
   * @param {*} text 
   */
  showQrCode(text = "") {
    const id = `img-${this.mget(_a.widgetId)}`;
    let i = setInterval(async () => {
      let img = document.getElementById(id);
      if (img) {
        clearInterval(i);
        let { toDataURL } = require("qrcode");
        let src = await toDataURL(text);
        img.width = 140;
        img.height = 140;
        img.src = src;
      }
    }, 300);
  }

  /**
   * 
   */
  handleError(args = {}) {
    const { error } = args
    switch (error) {
      case "LOW_SEEDS_LEVEL":
        this.feed(require("./skeleton/error")(this, LOCALE.SBX_TOO_MUCH_REQUESTS));
        break;
      default:
        if (error) {
          this.feed(require("./skeleton/error")(this, error));
        }
    }
  }
  /**
   * 
   */
  start(cmd) {
    let opt = {};
    if (localStorage.getItem('sandboxDomain')) {
      opt = {
        domain: localStorage.getItem('sandboxDomain'),
        socket_id: Visitor.get(_a.socket_id)
      }
    }
    this.postService("sandbox.create", opt).then((users) => {
      if (!users) {
        this.warn("NO_USER");
        return;
      }
      if (users.error) {
        this.handleError(users);
        return;
      }
      if (!users[0]) {
        this.handleError({ error: LOCALE.SOMETHING_WENT_WRONG });
        return;
      }
      this.users = users;
      localStorage.setItem('sandboxDomain', users[0].domain);
      this.ensurePart(_a.content).then((p) => {
        p.feed(require('./skeleton/users')(this, users));
      })
    }).catch((e) => {
      this.warn("CREATE_ERROR", e)
      cmd.set({ content: LOCALE.SOMETHING_WENT_WRONG })
    })
    setTimeout(() => {
      cmd.set({
        content: LOCALE.WAIT_FOR_CREATION.format('Sandbox'),
        service: "processing"
      })
    }, 500)
  }

  /**
   * 
   */
  reset(cmd) {
    let token = this.__list.children.first().mget(_a.token);
    const opt = {
      socket_id: Visitor.get(_a.socket_id),
      token
    }
    Butler.confirm(LOCALE.DELETE_PERMENANTLY).then(() => {
      this.postService('sandbox.remove', opt).then((r) => {
        localStorage.removeItem('sandboxDomain');
        this.feed(require('./skeleton/thanks')(this));
      }).catch((e) => {
        this.debug("AAA:128", e)
        this.handleError({error:LOCALE.SOMETHING_WENT_WRONG})
      })
    }).catch(() => {
      this.handleError({error:LOCALE.SOMETHING_WENT_WRONG})
    })
  }

  /**
   * 
   * @returns 
   */
  showFooter(timeout = 10000) {
    let opt;
    this.ensurePart("footer").then((p) => {
      if (this.users && this.users.length) {
        opt = {
          service: _a.reset,
          content: LOCALE.SBX_DELETE_DATA
        }
      } else {
        opt = {
          service: _e.start,
          content: LOCALE.SBX_START
        }
      }
      this.timer = setTimeout(() => {
        p.feed(require("./skeleton/launch-pad")(this, opt))
        this.timer = null;
      }, timeout)
    })
  }

  /**
   * 
   */
  reload() {
    const domain = localStorage.getItem('sandboxDomain');
    this.fetchService('sandbox.get_env', { domain }).then((r) => {
      const { quota, users } = r;
      this.users = users;
      this.quota = quota;
      if (users && users.length) {
        this.feed(require('./skeleton/existing')(this, users));
      } else {
        this.feed(require('./skeleton/maiden')(this));
      }
    }).catch(() => {
      this.feed(require('./skeleton/maiden')(this));
    })
  }


  /**
   * Upon DOM refresh, after element actually insterted into DOM
   */
  onDomRefresh() {
    this.bindEvent("live", "sandbox");
    this.reload()
  }

  /**
   * 
   * @param {*} child 
   * @param {*} pn 
   */
  onPartReady(child, pn) {
    switch (pn) {
      case "message-container":
        this.waitElement(child.el, () => {
          this.messagePosition = child.$el.position();
        })
        break;
    }
  }

  /**
   * User Interaction Evant Handler
   * @param {View} cmd
   * @param {Object} args
   */
  onUiEvent(cmd, args = {}) {
    const service = args.service || cmd.get(_a.service);
    const { url } = args;
    let xOffset = 0;
    let timeout = 2000;
    switch (service) {
      case _a.start:
        this.start(cmd);
        break;
      case _a.copy:
        copyToClipboard(url);
        break;
      case "show-qr-code":
        xOffset = 70;
        timeout = 60000;
        this.showQrCode(url);
        break;
      case "processing":
        cmd.set({
          content: LOCALE.PROCESSING,
        })
        return;
      case _a.close:
        this.__message && this.__message.clear();
        return;
      case _a.reset:
        this.reset(cmd);
        return;

      case 'change-lang':
        let lang = cmd.mget(_a.value);
        if (lang == this.mget(_a.lang)) {
          return;
        }
        this.mset({ lang })
        const locale = require('./locale')(lang);
        LOCALE = { ...Drumee.locale(lang), ...locale };
        this.reload();
        return;

      case 'reload':
        this.reload();
        return;

      case "trial-started":
        this.showFooter();
        return;
      default:
        return;
    }
    let msg = this.__message;
    if (!msg || msg.isDestroyed()) return;
    let { top, left } = cmd.$el.offset();
    let { left: x, top: y } = this.messagePosition;
    left = left - x + xOffset;
    top = top - 200;
    if (top < 0) top = 0;
    msg.$el.css({ top, left });
    let skeleton = require('./skeleton/message')(this, service);
    msg.feed(skeleton);
    setTimeout(() => {
      let c = msg.children.last();
      if (c) {
        c.goodbye({
          callback: () => {
            msg.clear();
          }
        })
      } else {
        msg.clear();
      }
    }, timeout)
  }

  /**
   * 
   */
  onServerComplain(xhr) {
    this.debug("Request failed", xhr)
  }

  /** Optional. 
   * uncomment and call this.bindEvent to subscribe to websocket events
   **/
  /** 
   * Websocket Service Endpoint
   * @param {String} service
   * @param {Object} options
   */
  websocketRoute(service, data, options) {
    switch (service) {
      case "sandbox.progress":
        let { total, progress } = data;
        let r = 100 * progress / total;
        this.__progress.el.style.width = `${r}%`;
        if (r > 99) {
          this.__footer.el.dataset.state = _a.closed;
          this.__progress.el.style.width = 0;
          this.__footer.clear();
        }
        break;
    }
  }
}

module.exports = ___sandbox_app